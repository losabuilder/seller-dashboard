'use client'

import { USDCTransfer } from '@/app/components/USDCTransfer'
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets'
import { usePrivy } from '@privy-io/react-auth'

export default function USDCDemoPage() {
  const { authenticated } = usePrivy()
  const { client } = useSmartWallets()
  
  // Get the smart wallet address if authenticated and client is available
  const walletAddress = authenticated && client ? client.account.address : null
  
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">USDC Transfer Demo</h1>
          <p className="text-gray-500">
            This demo showcases how to approve and transfer USDC using Privy smart wallets
          </p>
        </div>
        
        {authenticated && walletAddress && (
          <div className="mb-6 p-4 border rounded-lg text-center">
            <h2 className="text-lg font-semibold mb-1">Your Smart Wallet</h2>
            <div className="flex items-center justify-center">
              <code className="px-3 py-1 rounded border text-sm break-all">
                {walletAddress}
              </code>
              <button 
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  alert('Address copied to clipboard!');
                }}
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-sm text-blue-700">
              You need USDC in this wallet to perform transfers
            </p>
          </div>
        )}
        
        <div className="mb-8 p-6 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Connect your wallet using Privy</li>
            <li>Enter the amount of USDC to transfer</li>
            <li>Enter the recipient&apos;s Ethereum address</li>
            <li>Choose whether to use a batch transaction or separate transactions</li>
            <li>Submit the form to execute the transaction(s)</li>
          </ol>
          
          <div className="mt-4 p-4 border border-blue-200 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Technical Details</h3>
            <p className="text-sm">
              This demo uses the <code>useUSDCWorkflow</code> hook to orchestrate the approval and transfer of USDC.
              The workflow handles state management, transaction execution, and error handling.
            </p>
          </div>
        </div>
        
        {authenticated && (
          <div className="mb-8 p-6 border border-amber-200 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Getting Test USDC</h2>
            <p className="mb-4">
              To use this demo, you need USDC in your smart wallet. If you encounter an <strong>&quot;transfer amount exceeds balance&quot;</strong> error, it means you don&apos;t have enough USDC.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Options to get USDC:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Base Testnet (Sepolia):</strong> Use the{" "}
                <a 
                  href="https://www.coinbase.com/faucets/base-sepolia-faucet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Base Sepolia Faucet
                </a> to get testnet ETH, then swap for USDC using a testnet DEX.
              </li>
              <li>
                <strong>Base Mainnet:</strong> Transfer a small amount of USDC from an exchange to your smart wallet address shown above.
              </li>
            </ol>
            
            <div className="mt-4 p-3 rounded border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> For this demo, you only need a very small amount of USDC (e.g., 1-5 USDC). Make sure to copy your smart wallet address shown above, not your EOA wallet address.
              </p>
            </div>
          </div>
        )}
        
        <USDCTransfer />
      </div>
    </div>
  )
} 