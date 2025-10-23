import { Address, encodeFunctionData } from "viem";

import { getFactoryChainConfig } from "../../config/factories";
import { ContractName } from "../../config/types";


export type CreatePauseProductContractInput = {
  owner: Address
  salt: `0x${string}`
}

/**
 * Service for pause product plugin
 */
export class PauseProductPluginService {
  /**
   * Create a pause product plugin contract call
   */
  static createPauseProductContractCall(
    chainId: number,
    input: CreatePauseProductContractInput
  ) {
    const pauseProductPluginFactoryConfig = getFactoryChainConfig(
      ContractName.PauseProductBeforeOrderPluginFactory,
      chainId
    )

    // predict the address
    const predictedPauseProductAddress =
      pauseProductPluginFactoryConfig.deployableContracts.PauseProductBeforeOrderPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.owner],
        }
      )

    const call = {
      to: pauseProductPluginFactoryConfig.address,
      data: encodeFunctionData({
        abi: pauseProductPluginFactoryConfig.abi,
        functionName: "deploy",
        args: [input.owner, input.salt],
      })
    }

    return {
      calls: [call],
      predictedAddress: predictedPauseProductAddress,
    }
  }
}