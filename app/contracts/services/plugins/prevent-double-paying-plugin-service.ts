import { Address, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../../config/factories"
import { ContractName } from "../../config/types"

export type CreatePreventDoublePayingContractInput = {
  owner: Address
  salt: `0x${string}`
}

/**
 * Service for prevent double paying contract interactions
 */
export class PreventDoublePayingPluginService {
  /**
   * Create a prevent double paying contract call
   */
  static createPreventDoublePayingContractCall(
    chainId: number,
    input: CreatePreventDoublePayingContractInput
  ) {
    const preventDoublePayingFactoryConfig = getFactoryChainConfig(
      ContractName.PreventDoublePayingPluginFactory,
      chainId
    )

    // predict the order address
    const predictedPreventDoublePayingAddress =
      preventDoublePayingFactoryConfig.deployableContracts.PreventDoublePayingPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.owner],
        }
      )

    const call = {
      to: preventDoublePayingFactoryConfig.address,
      data: encodeFunctionData({
        abi: preventDoublePayingFactoryConfig.abi,
        functionName: "deploy",
        args: [input.owner, input.salt],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedPreventDoublePayingAddress,
    }
  }
}
