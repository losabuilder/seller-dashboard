import { Address, Call, encodeFunctionData } from "viem"

import {
  getFactoryChainConfig,
  PredictAddressParameters,
} from "../config/factories"
import { CONTRACT_ABI_MAPPING, ContractName } from "../config/types"

export type AddPluginResolverToPluginManagerInput = {
  variationUId: `0x${string}`
  pluginResolverAddress: Address
  contractName: ContractName
}

type PluginResolverPredictParams = Omit<
  PredictAddressParameters<
    (typeof CONTRACT_ABI_MAPPING)[ContractName.PluginResolver]
  >,
  "factoryAddress"
>

/**
 * Service for plugin resolver interactions
 */
export class PluginResolverService {
  /**
   * Create a predict plugin resolver address call
   */
  static predictPluginResolverAddress(
    chainId: number,
    params: PluginResolverPredictParams
  ) {
    const config = getFactoryChainConfig(
      ContractName.PluginResolverFactory,
      chainId
    )
    return config.deployableContracts.PluginResolver.predictAddress(params)
  }

  /**
   * Create a plugin resolver call
   */
  static createPluginResolverCall(
    chainId: number,
    input: PluginResolverPredictParams
  ) {
    const config = getFactoryChainConfig(
      ContractName.PluginResolverFactory,
      chainId
    )

    return {
      to: config.address,
      data: encodeFunctionData({
        abi: config.abi,
        functionName: "deploy",
        args: [input.salt, ...input.args],
      }),
    }
  }

  /**
   * Create an add validating resolver call
   */
  static addValidatingResolverCall = (
    pluginResolverAddress: Address,
    pluginAddress: Address
  ): {
    calls: Call[]
  } => {
    const call = {
      to: pluginResolverAddress,
      data: encodeFunctionData({
        abi: CONTRACT_ABI_MAPPING[ContractName.PluginResolver],
        functionName: "addValidatingResolver",
        args: [pluginAddress],
      }),
    }
    return { calls: [call] }
  }
  
  /**
   * Create an add executing resolver call
   */
  static addExecutingResolverCall = (
    pluginResolverAddress: Address,
    pluginAddress: Address
  ): {
    calls: Call[]
  } => {
    const call = {
      to: pluginResolverAddress,
      data: encodeFunctionData({
        abi: CONTRACT_ABI_MAPPING[ContractName.PluginResolver],
        functionName: "addExecutingResolver",
        args: [pluginAddress, false],
      }),
    }
    return { calls: [call] }
  }
}
