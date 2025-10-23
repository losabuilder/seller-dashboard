import { Address, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../../config/factories"
import { ContractName } from "../../config/types"

export type CreateUpdatePricePluginsAfterOrderContractInput = {
  priceContract: Address
  eas: Address
  salt: `0x${string}`
}

/**
 * Service for update price plugins after order plugin
 */
export class UpdatePricePluginsAfterOrderPluginService {
  /**
   * Create a update price plugins after order contract call
   */
  static createUpdatePricePluginsAfterOrderContractCall(
    chainId: number,
    input: CreateUpdatePricePluginsAfterOrderContractInput
  ) {
    const updatePricePluginsAfterOrderPluginFactoryConfig = getFactoryChainConfig(
      ContractName.UpdatePricePluginsAfterOrderPluginFactory,
      chainId
    )

    // predict the order address
    const predictedUpdatePricePluginsAfterOrderAddress =
      updatePricePluginsAfterOrderPluginFactoryConfig.deployableContracts.UpdatePricePluginsAfterOrderPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.priceContract, input.eas],
        }
      )

    const call = {
      to: updatePricePluginsAfterOrderPluginFactoryConfig.address,
      data: encodeFunctionData({
        abi: updatePricePluginsAfterOrderPluginFactoryConfig.abi,
        functionName: "deploy",
        args: [input.priceContract, input.eas, input.salt],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedUpdatePricePluginsAfterOrderAddress,
    }
  }
}
