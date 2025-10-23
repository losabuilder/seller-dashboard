import { Abi, Address, encodeDeployData, getContractAddress as viemGetContractAddress } from "viem";
import type { ContractConstructorArgs, UnionEvaluate } from "viem";



import { CONTRACT_ABI_MAPPING, CONTRACT_BYTECODE_MAPPING, ContractName, FACTORY_DEPLOYABLE_MAPPING } from "./types";
import { getContractAddress } from "./utils";


// Type-safe predict address parameters using viem's pattern
export type PredictAddressParameters<
  abi extends Abi | readonly unknown[] = Abi,
  ///
  hasConstructor = abi extends Abi
    ? Abi extends abi
      ? true
      : [Extract<abi[number], { type: "constructor" }>] extends [never]
        ? false
        : true
    : true,
  allArgs = ContractConstructorArgs<abi>,
> = {
  salt: `0x${string}`
  factoryAddress: Address
} & UnionEvaluate<
  hasConstructor extends false
    ? { args?: undefined }
    : readonly [] extends allArgs
      ? { args?: allArgs | undefined }
      : { args: allArgs }
>

// Type-safe deployable contract config
export type DeployableContractConfig<
  abi extends Abi = Abi,
  HasChainId extends boolean = false,
> = {
  bytecode: `0x${string}`
  constructorAbi: abi
  predictAddress: (
    params: Omit<PredictAddressParameters<abi>, "factoryAddress"> &
      (HasChainId extends true ? object : { chainId: number })
  ) => Address
}

// Helper type to get deployable contracts for a specific factory
type DeployableContractsForFactory<T extends ContractName> =
  T extends keyof typeof FACTORY_DEPLOYABLE_MAPPING
    ? (typeof FACTORY_DEPLOYABLE_MAPPING)[T][number]
    : never

type FactoryChainConfig<T extends ContractName> = {
  address: Address
  chainId: number
  abi: (typeof CONTRACT_ABI_MAPPING)[T]
  deployableContracts: Record<
    DeployableContractsForFactory<T>,
    DeployableContractConfig<
      (typeof CONTRACT_ABI_MAPPING)[DeployableContractsForFactory<T>],
      true
    >
  >
}

// Helper to check if a contract is a factory
export const isFactoryContract = (contractName: ContractName): boolean => {
  return contractName in FACTORY_DEPLOYABLE_MAPPING
}

// Helper to get deployable contracts for a factory
export const getDeployableContracts = (
  factoryName: ContractName
): ContractName[] => {
  if (factoryName in FACTORY_DEPLOYABLE_MAPPING) {
    return [
      ...FACTORY_DEPLOYABLE_MAPPING[
        factoryName as keyof typeof FACTORY_DEPLOYABLE_MAPPING
      ],
    ]
  }
  return []
}

// Predict address for a deployable contract by passing in the deployable contract name and the parameters
export const predictAddress = (
  factoryContractName: ContractName,
  deployableContractName: ContractName,
  params: Omit<
    PredictAddressParameters<
      (typeof CONTRACT_ABI_MAPPING)[ContractName.PluginResolver]
    >,
    "factoryAddress"
  > & { chainId: number }
) => {
  const abi = CONTRACT_ABI_MAPPING[deployableContractName]
  const factoryAddress = getContractAddress(factoryContractName, params.chainId)
  if (!factoryAddress) {
    throw new Error(
      `Factory address not found for ${deployableContractName} on chain ${params.chainId}`
    )
  }
  return createPredictAddressFunction(
    factoryContractName,
    deployableContractName,
    abi
  )(params)
}

// Create type-safe predictAddress function for a deployable contract by passing in the deployable contract name and the ABI
export const createPredictAddressFunction = <const abi extends Abi>(
  factoryContractName: ContractName,
  deployableContractName: ContractName,
  abi: abi,
  chainId?: number
) => {
  return (
    params: Omit<PredictAddressParameters<abi>, "factoryAddress"> &
      (typeof chainId extends number ? object : { chainId: number })
  ) => {
    // Use provided chainId or from params
    const finalChainId = chainId ?? (params as { chainId: number }).chainId

    // Get factory address for the chain
    const factoryAddress = getContractAddress(factoryContractName, finalChainId)
    if (!factoryAddress) {
      throw new Error(
        `Factory address not found for ${factoryContractName} on chain ${finalChainId}`
      )
    }

    // Type assertion to work around complex viem typing
    const encodeParams = {
      abi,
      bytecode: CONTRACT_BYTECODE_MAPPING[
        deployableContractName as keyof typeof CONTRACT_BYTECODE_MAPPING
      ] as `0x${string}`,
      args: params.args,
    } as Parameters<typeof encodeDeployData>[0]

    const bytecode = encodeDeployData(encodeParams)

    return viemGetContractAddress({
      from: factoryAddress,
      opcode: "CREATE2",
      salt: params.salt,
      bytecode,
    })
  }
}

// Create factory chain config for a factory contract
export const getFactoryChainConfig = <T extends ContractName>(
  factoryContract: T,
  chainId: number
): FactoryChainConfig<T> => {
  const deployableContracts = getDeployableContracts(factoryContract)
  const factoryConfig = {
    address: getContractAddress(factoryContract, chainId),
    chainId,
    abi: CONTRACT_ABI_MAPPING[factoryContract],
    deployableContracts: {} as Record<
      DeployableContractsForFactory<T>,
      DeployableContractConfig<
        (typeof CONTRACT_ABI_MAPPING)[DeployableContractsForFactory<T>]
      >
    >,
  } as FactoryChainConfig<T>

  deployableContracts.forEach((deployableContract) => {
    const abi = CONTRACT_ABI_MAPPING[deployableContract]
    const predictAddressFn = createPredictAddressFunction(
      factoryContract,
      deployableContract,
      abi,
      chainId
    )
    const config = {
      bytecode:
        CONTRACT_BYTECODE_MAPPING[
          deployableContract as keyof typeof CONTRACT_BYTECODE_MAPPING
        ],
      constructorAbi: abi,
      predictAddress: predictAddressFn,
    } as unknown as DeployableContractConfig<typeof abi, true>

    // Type assertion needed due to complex mapped type limitations
    ;(
      factoryConfig.deployableContracts as unknown as Record<
        string,
        DeployableContractConfig<Abi, true>
      >
    )[deployableContract] = config as unknown as DeployableContractConfig<
      Abi,
      true
    >
  })
  return factoryConfig
}