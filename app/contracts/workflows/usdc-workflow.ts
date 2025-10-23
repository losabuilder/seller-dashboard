"use client";

import { useState } from "react";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { encodeFunctionData } from "viem";
import { useChainId } from "wagmi";

import { USDCTokenABI } from "../abis/tokens/USDCToken";
import { useTransactionExecutor } from '../hooks/useTransactionExecutor';
import { TransactionBuilder } from '../services/transaction-builder';

// USDC workflow steps
export enum USDCWorkflowStep {
  IDLE = "idle",
  APPROVING = "approving",
  TRANSFERRING = "transferring",
  COMPLETED = "completed",
  ERROR = "error",
}

// USDC workflow state
export type USDCWorkflowState = {
  step: USDCWorkflowStep
  approvalTxHash: string | null
  transferTxHash: string | null
  error: Error | null
}

// USDC workflow input
export type USDCWorkflowInput = {
  amount: bigint
  recipientAddress: string
}

// USDC contract addresses for different networks
const USDC_ADDRESSES = {
  // Base Mainnet
  8453: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Replace with actual base mainnet address if different
  // Base Sepolia (testnet)
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
}

/**
 * Hook for orchestrating USDC approval and transfer
 */
export function useUSDCWorkflow() {
  const { client } = useSmartWallets()
  const chainId = useChainId() || 8453 // Default to Base Mainnet if chainId is not available
  const { executeTransaction, isLoading: isExecuting, getTransactionReceipt } = useTransactionExecutor()
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState<USDCWorkflowState>({
    step: USDCWorkflowStep.IDLE,
    approvalTxHash: null,
    transferTxHash: null,
    error: null,
  })

  // Get the appropriate USDC address for the current chain
  const USDC_ADDRESS =
    USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] ||
    USDC_ADDRESSES[8453]

  /**
   * Check USDC balance for an address
   */
  const checkUSDCBalance = async (): Promise<bigint> => {
    try {
      // Get the smart wallet address
      if (!client || !client.account.address) {
        console.warn("Smart wallet client not available");
        return 0n;
      }
      
      // USDC contract address on Base Sepolia
      const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || USDC_ADDRESS;
      if (!usdcAddress) {
        console.warn("USDC address not configured");
        return 0n;
      }
      
      // Create a public client using the Alchemy URL
      const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
      if (!alchemyUrl) {
        console.warn("Alchemy URL not configured");
        return 0n;
      }
      
      // Use Alchemy's token balance API instead of direct contract call
      const ownerAddr = client.account.address;
      
      // Prepare the request body for Alchemy API
      const requestBody = JSON.stringify({
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenBalances",
        "params": [
          ownerAddr,
          [usdcAddress]
        ],
        "id": 42
      });
      
      // Make the request to Alchemy
      const response = await fetch(alchemyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Alchemy token balance response:", data);
      
      // Extract the balance from the response
      let balance = 0n;
      if (data.result && data.result.tokenBalances && data.result.tokenBalances.length > 0) {
        const tokenBalance = data.result.tokenBalances[0];
        if (tokenBalance.tokenBalance) {
          // Convert hex balance to bigint
          balance = BigInt(tokenBalance.tokenBalance);
        }
      }
      
      console.log(`USDC Balance for ${client.account.address}: ${balance}`);
      return balance as bigint;
    } catch (error) {
      console.error("Error checking USDC balance:", error);
      return 0n;
    }
  }

  /**
   * Approve and transfer USDC
   * This is the main function that orchestrates the entire workflow
   */
  const approveAndTransferUSDC = async (
    data: USDCWorkflowInput
  ): Promise<void> => {
    if (!client) {
      setState((prev) => ({
        ...prev,
        step: USDCWorkflowStep.ERROR,
        error: new Error("Smart wallet client not available"),
      }))
      return
    }

    setIsLoading(true)
    setState((prev) => ({ ...prev, step: USDCWorkflowStep.APPROVING }))

    try {
      // Get the connected wallet address to use as the spender
      const walletAddress = client.account.address

      // Step 1: Approve USDC
      const txBuilder = new TransactionBuilder()
      txBuilder.addCall({
        to: USDC_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: USDCTokenABI,
          functionName: "approve",
          args: [walletAddress, data.amount],
        }),
      })

      const approvalTxHash = await executeTransaction(txBuilder.getCalls())
      if (!approvalTxHash) {
        throw new Error("Failed to approve USDC")
      }

      setState((prev) => ({
        ...prev,
        approvalTxHash,
        step: USDCWorkflowStep.TRANSFERRING,
      }))

      // Step 2: Transfer USDC
      txBuilder.clear()
      txBuilder.addCall({
        to: USDC_ADDRESS as `0x${string}`,
        data: encodeFunctionData({
          abi: USDCTokenABI,
          functionName: "transfer",
          args: [data.recipientAddress as `0x${string}`, data.amount],
        }),
      })

      const transferTxHash = await executeTransaction(txBuilder.getCalls())
      if (!transferTxHash) {
        throw new Error("Failed to transfer USDC")
      }

      const receipt = await getTransactionReceipt(transferTxHash)
      if (!receipt) {
        throw new Error("Failed to get transaction receipt")
      }
      console.log('receipt:', receipt)

      setState((prev) => ({
        ...prev,
        transferTxHash,
        step: USDCWorkflowStep.COMPLETED,
      }))
    } catch (error) {
      console.error("USDC workflow failed:", error)
      setState((prev) => ({
        ...prev,
        step: USDCWorkflowStep.ERROR,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Batch approve and transfer USDC in a single transaction
   */
  const batchApproveAndTransferUSDC = async (
    data: USDCWorkflowInput
  ): Promise<void> => {
    if (!client) {
      setState((prev) => ({
        ...prev,
        step: USDCWorkflowStep.ERROR,
        error: new Error("Smart wallet client not available"),
      }))
      return
    }

    setIsLoading(true)
    setState((prev) => ({ ...prev, step: USDCWorkflowStep.APPROVING }))

    try {
      // Get the connected wallet address to use as the spender
      const walletAddress = client.account.address

      // Execute both approve and transfer in a single transaction
      const txBuilder = new TransactionBuilder()
      txBuilder.addCalls([
        // Approve transaction
        {
          to: USDC_ADDRESS as `0x${string}`,
          data: encodeFunctionData({
            abi: USDCTokenABI,
            functionName: "approve",
            args: [walletAddress, data.amount],
          }),
        },
        // Transfer transaction
        {
          to: USDC_ADDRESS as `0x${string}`,
          data: encodeFunctionData({
            abi: USDCTokenABI,
            functionName: "transfer",
            args: [data.recipientAddress as `0x${string}`, data.amount],
          }),
        },
      ])

      const txHash = await executeTransaction(txBuilder.getCalls())
      if (!txHash) {
        throw new Error("Failed to execute batch transaction")
      }

      const transferTxHash = await executeTransaction(txBuilder.getCalls())
      if (!transferTxHash) {
        throw new Error("Failed to transfer USDC")
      }

      const receipt = await getTransactionReceipt(transferTxHash)
      if (!receipt) {
        throw new Error("Failed to get transaction receipt")
      }
      console.log("receipt:", receipt)

      setState((prev) => ({
        ...prev,
        approvalTxHash: txHash,
        transferTxHash: txHash,
        step: USDCWorkflowStep.COMPLETED,
      }))
    } catch (error) {
      console.error("USDC workflow failed:", error)
      setState((prev) => ({
        ...prev,
        step: USDCWorkflowStep.ERROR,
        error: error instanceof Error ? error : new Error(String(error)),
      }))
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset the workflow
   */
  const reset = () => {
    setState({
      step: USDCWorkflowStep.IDLE,
      approvalTxHash: null,
      transferTxHash: null,
      error: null,
    })
  }

  /**
   * Get token metadata (symbol, name, decimals, etc.)
   */
  const getTokenMetadata = async (): Promise<unknown> => {
    try {
      // USDC contract address
      const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}` || USDC_ADDRESS;
      if (!usdcAddress) {
        console.warn("USDC address not configured");
        return null;
      }
      
      // Get Alchemy URL
      const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
      if (!alchemyUrl) {
        console.warn("Alchemy URL not configured");
        return null;
      }
      
      // Prepare the request body for Alchemy API
      const requestBody = JSON.stringify({
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenMetadata",
        "params": [usdcAddress],
        "id": 42
      });
      
      // Make the request to Alchemy
      const response = await fetch(alchemyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Token metadata:", data);
      
      return data.result;
    } catch (error) {
      console.error("Error getting token metadata:", error);
      return null;
    }
  }

  return {
    approveAndTransferUSDC,
    batchApproveAndTransferUSDC,
    checkUSDCBalance,
    getTokenMetadata,
    reset,
    state,
    isLoading: isLoading || isExecuting,
    usdcAddress: USDC_ADDRESS,
  }
}