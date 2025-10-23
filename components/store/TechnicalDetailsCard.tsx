"use client"

import { Address } from "@coinbase/onchainkit/identity"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { StoreData } from "@/types/store"

interface TechnicalDetailsCardProps {
  storeData: StoreData
  contractDataLoading: boolean
  chainId: number
  smartWalletAddress?: `0x${string}`
}

export function TechnicalDetailsCard({
  storeData,
  contractDataLoading,
  chainId,
  smartWalletAddress,
}: TechnicalDetailsCardProps) {
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 84532:
        return "Base Sepolia"
      case 8453:
        return "Base Mainnet"
      case 1:
        return "Ethereum Mainnet"
      default:
        return `Chain ID: ${chainId}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Details</CardTitle>
        <CardDescription>
          Smart contract and blockchain information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Order Contract
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {storeData.orderContract ? (
              <Address address={storeData.orderContract as `0x${string}`} />
            ) : (
              "Not deployed"
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Order Paid Schema
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {storeData.orderPaidSchema ? (
              <Address address={storeData.orderPaidSchema as `0x${string}`} />
            ) : contractDataLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              "Not available"
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Refund Schema
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {storeData.refundSchema ? (
              <Address address={storeData.refundSchema as `0x${string}`} />
            ) : contractDataLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              "Not available"
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Price Contract
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {storeData.priceContract ? (
              <Address address={storeData.priceContract as `0x${string}`} />
            ) : contractDataLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              "Not available"
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Inventory Contract
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {storeData.inventoryContract ? (
              <Address address={storeData.inventoryContract as `0x${string}`} />
            ) : contractDataLoading ? (
              <span className="text-muted-foreground">Loading...</span>
            ) : (
              "Not available"
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Plugins
          </label>
          <div className="bg-muted rounded p-2">
            {storeData.plugins && storeData.plugins.length > 0 ? (
              <div className="space-y-1">
                {storeData.plugins.map((plugin: `0x${string}`, index: number) => (
                  <div key={index} className="text-xs">
                    {typeof plugin === "string"
                      ? plugin
                      : JSON.stringify(plugin)}
                  </div>
                ))}
              </div>
            ) : contractDataLoading ? (
              <span className="text-muted-foreground text-xs">Loading...</span>
            ) : (
              <span className="text-muted-foreground text-xs">
                No plugins configured
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Network
          </label>
          <Badge variant="secondary">{getChainName(chainId)}</Badge>
        </div>

        <div>
          <label className="text-muted-foreground text-sm font-medium">
            Wallet Address
          </label>
          <div className="bg-muted rounded p-2 font-mono text-xs break-all">
            {smartWalletAddress ? (
              <Address address={smartWalletAddress} />
            ) : (
              "Not connected"
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
