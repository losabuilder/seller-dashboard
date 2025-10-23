import { Abi, Address } from "viem"
import { useChainId } from "wagmi"

import {
  getContractConfig,
  isChainSupportedForContract,
} from "../config/contracts"
import { ContractName } from "../config/types"

/**
 * Custom hook to get contract configuration for the current network
 *
 * @param contractName The name of the contract to get configuration for
 * @param customChainId Optional custom chain ID to override the current network
 * @returns Contract configuration and support status
 */
export function useContract<TAbi extends Abi>(
  contractName: ContractName,
  customChainId?: number,
  overrideAddress?: Address
) {
  // Get the current chain ID from wagmi
  const currentChainId = useChainId()

  // Use custom chain ID if provided, otherwise use current chain
  const chainId = customChainId ?? currentChainId ?? 0

  // Check if the contract supports the current chain or an override is provided
  const isSupported =
    !!overrideAddress || isChainSupportedForContract(contractName, chainId)

  // Get contract configuration if supported
  const config = isSupported
    ? getContractConfig<TAbi>(contractName, chainId, overrideAddress)
    : null

  return {
    config,
    isSupported,
    chainId,
  }
}

/**
 * Example usage with wagmi hooks:
 *
 * ```tsx
 * import { useContractRead } from 'wagmi'
 * import { useContract } from '@/contracts/hooks/useContract'
 * import { ContractName } from '@/contracts/config/types'
 * import { EAS_ABI } from '@/contracts/abis/eas'
 *
 * function MyComponent() {
 *   const { config, isSupported } = useContract<typeof EAS_ABI>(ContractName.EAS)
 *
 *   const { data } = useContractRead({
 *     ...config,
 *     functionName: 'someFunction',
 *     enabled: isSupported && !!config,
 *   })
 *
 *   if (!isSupported) {
 *     return <div>Current chain not supported</div>
 *   }
 *
 *   return <div>{data}</div>
 * }
 * ```
 */
