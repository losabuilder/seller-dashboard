"use client"

import { useState } from "react"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { Call } from "viem"
import {
  useTransactionReceipt,
  useWaitForTransactionReceipt,
} from "wagmi"


/**
 * Hook for executing transactions with Privy smart wallets
 */
export function useTransactionExecutor() {
  const { client } = useSmartWallets()
  // todo: uncomment this when we have a way to set the active wallet
  // const { setActiveWallet } = useSetActiveWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>(
    undefined
  )

  // Use Wagmi's hook to track transaction status
  const {
    data: receipt,
    isLoading: isWaitingForReceipt,
  } = useWaitForTransactionReceipt({
    hash: currentTxHash,
  })

  const { data: transactionReceipt } = useTransactionReceipt({
    hash: currentTxHash,
  })

  /**
   * Execute a transaction with multiple calls
   */
  const executeTransaction = async (
    calls: Call[]
  ): Promise<string | null> => {
    setIsLoading(true)
    setError(null)
    setCurrentTxHash(undefined)

    try {
      if (!client) {
        throw new Error("Smart wallet client not available")
      }

      if (calls.length === 0) {
        throw new Error("No calls to execute")
      }

      // todo: uncomment this when we have a way to set the active wallet
      // Set the active wallet in Wagmi
      // await setActiveWallet(client)

      // Convert our TransactionCall format to Privy's expected format
      const privyCalls = calls.map((call) => ({
        to: call.to as `0x${string}`,
        data: call.data as `0x${string}`,
        value: call.value ?? 0n,
      }))

      console.log("privyCalls:", privyCalls)

      // Execute the transaction using the Privy smart wallet client
      const hash = await client.sendTransaction({
        calls: privyCalls,
      })

      console.log("hash:", hash)

      setCurrentTxHash(hash as `0x${string}`)
      return hash
    } catch (err) {
      console.log("error:", err)
      
      // Try to extract the error reason using regex
      try {
        const errorMessage = String(err);
        
        // Extract the error data (0x...) from the error message
        const errorDataMatch = errorMessage.match(/reason: (0x[0-9a-fA-F]+)/);
        if (errorDataMatch && errorDataMatch[1]) {
          const errorData = errorDataMatch[1];
          console.log("Extracted error data:", errorData);
          
          // The first 4 bytes (10 characters including 0x) are the error selector
          const errorSelector = errorData.substring(0, 10);
          console.log("Error selector:", errorSelector);
          
          // Common error selectors
          const knownErrors: Record<string, string> = {
            "0x08c379a0": "Error(string)",
            "0x4e487b71": "Panic(uint256)",
            "0x1b81a667": "InvalidAddressError(address)",
            "0x8baa579f": "InvalidSchemaError(bytes32)",
            "0x815e1d64": "InvalidSignatureError()",
            "0x7939f424": "InsufficientAllowanceError()",
            "0x157bd4c3": "Irrevocable()", // eas
            // Add more known error selectors as you encounter them
          };
          
          if (knownErrors[errorSelector]) {
            console.log("Known error type:", knownErrors[errorSelector]);
            
            // For InvalidAddressError, extract the address
            if (errorSelector === "0x1b81a667") {
              // The address starts at position 10 and is 40 characters long (without 0x)
              const addressHex = "0x" + errorData.substring(10, 10 + 40);
              console.log("Invalid address:", addressHex);
              setError(new Error(`InvalidAddressError: ${addressHex}`));
              return null;
            }
          }
        }
      } catch (parseErr) {
        console.log("Error parsing error data:", parseErr);
      }
      
      // Fallback to generic error handling
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Get transaction receipt using Wagmi's useWaitForTransactionReceipt hook
   * Polls until logs are available
   */
  const getTransactionReceipt = async (hash: string) => {
    setCurrentTxHash(hash as `0x${string}`)

    // Fallback to hook data
    const currentReceipt = {
      transactionHash: hash,
      status: receipt?.status,
      receipts: receipt ? [receipt] : [],
      logs: transactionReceipt?.logs,
      isLoading: isWaitingForReceipt,
    }
    return currentReceipt
  }

  return {
    executeTransaction,
    getTransactionReceipt,
    isLoading: isLoading || isWaitingForReceipt,
    error,
    client,
  }
}
