'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePrivy } from '@privy-io/react-auth'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { useUSDCWorkflow, USDCWorkflowStep } from '../contracts/workflows/usdc-workflow'
import { formatUnits } from 'viem'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// Form schema for USDC transfer
const formSchema = z.object({
  amount: z.string().min(1, {
    message: 'Amount is required',
  }),
  recipientAddress: z.string().min(42, {
    message: 'Valid Ethereum address required',
  }).max(42),
  useBatchTransaction: z.boolean(),
})

export function USDCTransfer() {
  const { authenticated, login } = usePrivy()
  const { client } = useSmartWallets()
  const { 
    approveAndTransferUSDC, 
    batchApproveAndTransferUSDC, 
    checkUSDCBalance,
    state, 
    isLoading, 
    reset,
    usdcAddress
  } = useUSDCWorkflow()
  
  const [txComplete, setTxComplete] = useState(false)
  const [balance, setBalance] = useState<bigint | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      recipientAddress: '',
      useBatchTransaction: false,
    },
  })

  // Fetch USDC balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!authenticated || !client) return
      
      setIsLoadingBalance(true)
      try {
        // Use the checkUSDCBalance method from the workflow
        const balanceBigInt = await checkUSDCBalance();
        setBalance(balanceBigInt);
      } catch (error) {
        console.error('Error fetching USDC balance:', error)
        setBalance(BigInt(0))
      } finally {
        setIsLoadingBalance(false)
      }
    }
    
    fetchBalance()
  }, [authenticated, client, state.step, checkUSDCBalance])

  // Format balance for display
  const formattedBalance = balance !== null 
    ? parseFloat(formatUnits(balance, 6)).toFixed(2) 
    : '0.00'

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setTxComplete(false)
    
    try {
      // Convert amount to BigInt (assuming 6 decimals for USDC)
      const amountInWei = BigInt(Math.floor(parseFloat(values.amount) * 1000000))
      
      // Check if user has enough balance
      // if (balance !== null && amountInWei > balance) {
      //   alert(`Insufficient balance. You have ${formattedBalance} USDC but are trying to transfer ${values.amount} USDC.`)
      //   return
      // }
      
      // Execute the workflow based on user preference
      if (values.useBatchTransaction) {
        await batchApproveAndTransferUSDC({
          amount: amountInWei,
          recipientAddress: values.recipientAddress,
        })
      } else {
        await approveAndTransferUSDC({
          amount: amountInWei,
          recipientAddress: values.recipientAddress,
        })
      }
      
      setTxComplete(true)
    } catch (error) {
      console.error('Transaction failed:', error)
    }
  }

  // Render login button if not authenticated
  if (!authenticated) {
    return (
      <div className="w-full max-w-md mx-auto border rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">USDC Transfer</h2>
          <p className="text-gray-500">Connect your wallet to transfer USDC</p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => login()}>Connect Wallet</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">USDC Transfer</h2>
        <p className="text-gray-500">Approve and transfer USDC to another address</p>
        
        {/* Balance display */}
        <div className="mt-3 p-3 rounded-md border flex justify-between items-center">
          <span className="text-sm font-medium">Your USDC Balance:</span>
          {isLoadingBalance ? (
            <span className="flex items-center">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Loading...
            </span>
          ) : (
            <span className="font-bold">{formattedBalance} USDC</span>
          )}
        </div>
        
        {/* Show Get USDC button if balance is zero */}
        {balance !== null && balance === BigInt(0) && !isLoadingBalance && (
          <div className="mt-2 flex justify-center">
            <a 
              href="https://www.coinbase.com/faucets/base-sepolia-faucet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Get Test ETH from Faucet
            </a>
          </div>
        )}
        
        {/* USDC Contract Address */}
        <div className="mt-2 text-xs text-gray-500">
          USDC Contract: <code className="px-1 py-0.5 rounded">{usdcAddress}</code>
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USDC)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the amount of USDC to transfer
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the Ethereum address of the recipient
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="useBatchTransaction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Batch Transaction</FormLabel>
                    <FormDescription>
                      Combine approve and transfer in a single transaction
                    </FormDescription>
                  </div>
                  <FormControl>
                    <div className="relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200 data-[state=checked]:bg-blue-500"
                      data-state={field.value ? "checked" : "unchecked"}
                      onClick={() => field.onChange(!field.value)}>
                      <span 
                        className="pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out translate-x-0 data-[state=checked]:translate-x-5"
                        data-state={field.value ? "checked" : "unchecked"}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Transaction Status */}
            {state.step !== USDCWorkflowStep.IDLE && (
              <div className={`p-4 border rounded-md ${
                state.step === USDCWorkflowStep.ERROR ? "border-red-500" : 
                state.step === USDCWorkflowStep.COMPLETED ? "border-green-500" : 
                "border-blue-500"
              }`}>
                {state.step === USDCWorkflowStep.APPROVING && (
                  <div className="flex items-start gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Approving USDC</h3>
                      <p className="text-sm text-gray-500">
                        Waiting for approval transaction to complete...
                      </p>
                    </div>
                  </div>
                )}
                
                {state.step === USDCWorkflowStep.TRANSFERRING && (
                  <div className="flex items-start gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Transferring USDC</h3>
                      <p className="text-sm text-gray-500">
                        Approval complete. Now transferring USDC...
                      </p>
                    </div>
                  </div>
                )}
                
                {state.step === USDCWorkflowStep.COMPLETED && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Transaction Complete</h3>
                      <p className="text-sm text-gray-500">
                        USDC transfer completed successfully!
                      </p>
                    </div>
                  </div>
                )}
                
                {state.step === USDCWorkflowStep.ERROR && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-medium">Transaction Failed</h3>
                      <p className="text-sm text-gray-500">
                        {state.error?.message || "An unknown error occurred"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={reset}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || state.step === USDCWorkflowStep.COMPLETED}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Transfer USDC"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {txComplete && (
        <div className="mt-6 pt-4 border-t flex flex-col items-start gap-2">
          <div className="text-sm font-medium">Transaction Details:</div>
          {state.approvalTxHash && (
            <div className="text-xs break-all">
              <span className="font-semibold">Approval TX:</span> {state.approvalTxHash}
            </div>
          )}
          {state.transferTxHash && (
            <div className="text-xs break-all">
              <span className="font-semibold">Transfer TX:</span> {state.transferTxHash}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 