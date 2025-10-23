import { Address, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../../config/factories"
import { ContractName } from "../../config/types"

export type CreateUpdatePricePluginsAfterRefundContractInput = {
  priceContract: Address
  eas: Address
  salt: `0x${string}`
}

/**
 * Service for update price plugins after refund plugin
 */
export class UpdatePricePluginsAfterRefundPluginService {
  /**
   * Create a update price plugins after refund contract call
   */
  static createUpdatePricePluginsAfterRefundContractCall(
    chainId: number,
    input: CreateUpdatePricePluginsAfterRefundContractInput
  ) {
    const updatePricePluginsAfterRefundPluginFactoryConfig = getFactoryChainConfig(
      ContractName.UpdatePricePluginsAfterRefundPluginFactory,
      chainId
    )

    // predict the address
    const predictedUpdatePricePluginsAfterRefundAddress =
      updatePricePluginsAfterRefundPluginFactoryConfig.deployableContracts.UpdatePricePluginsAfterRefundPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.priceContract, input.eas],
        }
      )

    const call = {
      to: updatePricePluginsAfterRefundPluginFactoryConfig.address,
      data: encodeFunctionData({
        abi: updatePricePluginsAfterRefundPluginFactoryConfig.abi,
        functionName: "deploy",
        args: [input.priceContract, input.eas, input.salt],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedUpdatePricePluginsAfterRefundAddress,
    }
  }
}
