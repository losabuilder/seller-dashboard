import { Abi, Address } from "viem"

import type { ContractConfig, ContractsConfig } from "./types"
import {
  ACTIVE_CHAIN_OBJECTS,
  CONTRACT_ABI_MAPPING,
  ContractName,
} from "./types"
import { getContractAddress, isContractSupported } from "./utils"

// Build contracts configuration using the new helper functions and ABI mapping
const buildContractsConfig = (): ContractsConfig => {
  const contracts: ContractsConfig = {} as ContractsConfig

  // Build all contracts using the ABI mapping
  Object.values(ContractName).forEach((contractName) => {
    contracts[contractName] = {
      abi: CONTRACT_ABI_MAPPING[contractName],
    }

    // Automatically check all active chains for this contract
    ACTIVE_CHAIN_OBJECTS.forEach((chain) => {
      if (isContractSupported(contractName, chain.id)) {
        contracts[contractName][chain.id] = {
          chain,
          address: getContractAddress(contractName, chain.id),
        }
      }
    })
  })

  return contracts
}

export const CONTRACTS: ContractsConfig = buildContractsConfig()

// Type-safe getter with runtime validation
export const getContractConfig = <TAbi extends Abi>(
  contractName: ContractName,
  chainId: number,
  overrideAddress?: Address
): ContractConfig<TAbi>[number] & { abi: TAbi } => {
  // Validate contract exists
  const contract = CONTRACTS[contractName]
  if (!contract) {
    throw new Error(`Contract ${contractName} not found`)
  }

  // Validate chain is supported
  if (!ACTIVE_CHAIN_OBJECTS.some((chain) => chain.id === chainId)) {
    throw new Error(`Chain ${chainId} is not supported`)
  }

  // Resolve chain object
  const chainObj = ACTIVE_CHAIN_OBJECTS.find((chain) => chain.id === chainId)
  if (!chainObj) {
    throw new Error(`Chain ${chainId} is not supported`)
  }

  // If an override address is provided (e.g., per-user contract), return it with the ABI
  if (overrideAddress) {
    return {
      abi: contract.abi as TAbi,
      address: overrideAddress,
      chain: chainObj,
    }
  }

  // Validate chain config exists
  const chainConfig = contract[chainId]
  if (!chainConfig) {
    throw new Error(
      `Invalid or missing chain configuration for ${contractName} on chain ${chainId}`
    )
  }

  return {
    abi: contract.abi as TAbi,
    address: chainConfig.address,
    chain: chainConfig.chain,
  }
}

export const tryGetContractConfig = <TAbi extends Abi>(
  contractName: ContractName,
  chainId: number,
  overrideAddress?: Address
): (ContractConfig<TAbi>[number] & { abi: TAbi }) | undefined => {
  try {
    return getContractConfig<TAbi>(contractName, chainId, overrideAddress)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

// Helper to get all supported chains for a contract
export const getContractSupportedChains = (
  contractName: ContractName
): number[] => {
  const supportedChains: number[] = []

  // Check all active chains we're configured to support
  ACTIVE_CHAIN_OBJECTS.forEach((chain) => {
    if (isContractSupported(contractName, chain.id)) {
      supportedChains.push(chain.id)
    }
  })

  return supportedChains
}

// Helper to check if a contract supports a specific chain
export const isChainSupportedForContract = (
  contractName: ContractName,
  chainId: number
): boolean => {
  return isContractSupported(contractName, chainId)
}
