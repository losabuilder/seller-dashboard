import { Address, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../../config/factories"
import { ContractName } from "../../config/types"

export type CreateDecreaseInventoryContractInput = {
  inventoryContract: Address
  eas: Address
  salt: `0x${string}`
}

/**
 * Service for decrease inventory plugin interactions
 */
export class DecreaseInventoryPluginService {
  /**
   * Create a decrease inventory contract call
   */
  static createDecreaseInventoryContractCall(
    chainId: number,
    input: CreateDecreaseInventoryContractInput
  ) {
    const decreaseInventoryPluginFactoryConfig = getFactoryChainConfig(
      ContractName.DecreaseInventoryPluginFactory,
      chainId
    )

    // predict the order address
    const predictedDecreaseInventoryAddress =
      decreaseInventoryPluginFactoryConfig.deployableContracts.DecreaseInventoryPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.inventoryContract, input.eas],
        }
      )

    const call = {
      to: decreaseInventoryPluginFactoryConfig.address,
      data: encodeFunctionData({
        abi: decreaseInventoryPluginFactoryConfig.abi,
        functionName: "deploy",
        args: [input.inventoryContract, input.eas, input.salt],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedDecreaseInventoryAddress,
    }
  }
}
