import { Address } from "viem"

import { CHAIN_CONFIG, CONTRACT_NAME_MAPPING } from "./generated-chain-config"
import { ACTIVE_CHAIN_OBJECTS, ContractName, SchemaName } from "./types"

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Helper function to validate addresses
export function validateAddress(address: string): Address {
  if (!address || address === "" || !address.startsWith("0x")) {
    throw new Error(`Invalid address format: ${address}`)
  }
  return address as Address
}

// Utility function to check if a chain is supported
export function isChainSupported(chainId: number): boolean {
  return ACTIVE_CHAIN_OBJECTS.some((chain) => chain.id === chainId)
}

// ============================================================================
// DATA ACCESS FUNCTIONS
// ============================================================================

// Get contract address with validation
export function getContractAddress(
  contractName: ContractName,
  chainId: number
): Address {
  const chainConfig =
    CHAIN_CONFIG[chainId.toString() as keyof typeof CHAIN_CONFIG]
  if (!chainConfig?.contracts) {
    throw new Error(`Chain ${chainId} not configured`)
  }

  const configKey =
    CONTRACT_NAME_MAPPING[contractName as keyof typeof CONTRACT_NAME_MAPPING]
  if (!configKey) {
    throw new Error(`Unknown contract name: ${contractName}`)
  }

  const address =
    chainConfig.contracts[configKey as keyof typeof chainConfig.contracts]

  if (!address) {
    throw new Error(`Contract ${contractName} not found for chain ${chainId}`)
  }

  return validateAddress(address)
}

// Get schema UID with fallback
export function getSchemaUID(
  schemaName: SchemaName,
  chainId: number
): `0x${string}` {
  const chainConfig =
    CHAIN_CONFIG[chainId.toString() as keyof typeof CHAIN_CONFIG]

  if (!chainConfig) {
    throw new Error(`Chain ${chainId} not supported`)
  }

  const schemaUID =
    chainConfig.schemas[schemaName as keyof typeof chainConfig.schemas]

  if (!schemaUID) {
    throw new Error(`Schema ${schemaName} not found for chain ${chainId}`)
  }

  return schemaUID
}

// Check if a contract is supported on a specific chain
export function isContractSupported(
  contractName: ContractName,
  chainId: number
): boolean {
  try {
    getContractAddress(contractName, chainId)
    return true
  } catch {
    return false
  }
}

// Direct export for when you want raw access
export { CHAIN_CONFIG }
