import { createConfig } from "@privy-io/wagmi"
import { http, Transport } from "wagmi"

import { ACTIVE_CHAIN_OBJECTS } from "./types"

// Create transports object dynamically from active chains
const transports = ACTIVE_CHAIN_OBJECTS.reduce<Record<number, Transport>>(
  (acc, chain) => ({
    ...acc,
    [chain.id]:
      chain.id === 84532
        ? http(
            `${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_ENDPOINT}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          )
        : http(),
  }),
  {} as Record<number, Transport>
)

export const wagmiConfig = createConfig({
  chains: ACTIVE_CHAIN_OBJECTS,
  transports,
})
