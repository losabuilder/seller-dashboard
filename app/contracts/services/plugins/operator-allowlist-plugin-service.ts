import { Address, encodeFunctionData } from "viem";

import { getFactoryChainConfig } from "../../config/factories";
import { ContractName } from "../../config/types";


export type CreateOperatorAllowlistContractInput = {
  owner: Address
  allowedOperators: Address[]
  defaultMaxFeeBps: number
  defaultMinRefundExpiry: number
  defaultMaxRefundExpiry: number
  salt: `0x${string}`
}

/**
 * Service for operator allowlist plugin
 */
export class OperatorAllowlistPluginService {
  /**
   * Create a operator allowlist plugin contract call
   */
  static createOperatorAllowlistContractCall(
    chainId: number,
    input: CreateOperatorAllowlistContractInput
  ) {
    const operatorAllowlistPluginFactoryConfig = getFactoryChainConfig(
      ContractName.OperatorAllowlistBeforeOrderPluginFactory,
      chainId
    )

    // predict the address
    const predictedOperatorAllowlistAddress =
      operatorAllowlistPluginFactoryConfig.deployableContracts.OperatorAllowlistBeforeOrderPlugin.predictAddress(
        {
          salt: input.salt,
          args: [input.owner, input.allowedOperators, input.defaultMaxFeeBps, input.defaultMinRefundExpiry, input.defaultMaxRefundExpiry],
        }
      )

    const call = {
      to: operatorAllowlistPluginFactoryConfig.address,
      data: encodeFunctionData({
        abi: operatorAllowlistPluginFactoryConfig.abi,
        functionName: "deploy",
        args: [input.owner, input.allowedOperators, input.defaultMaxFeeBps, input.defaultMinRefundExpiry, input.defaultMaxRefundExpiry, input.salt],
      })
    }

    return {
      calls: [call],
      predictedAddress: predictedOperatorAllowlistAddress,
    }
  }
}