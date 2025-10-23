import { Address, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../config/factories"
import { CONTRACT_ABI_MAPPING, ContractName } from "../config/types"

export type SetPriceData = {
  variationUId: `0x${string}`
  amount: bigint
  paymentToken: `0x${string}`
}

export type CreatePriceContractInput = {
  salt: `0x${string}`
  owner: Address
}

/**
 * Service for price contract interactions
 */
export class PriceService {
  /**
   * Create a price contract call
   */
  static createPriceContractCall(
    chainId: number,
    input: CreatePriceContractInput
  ) {
    const priceFactoryConfig = getFactoryChainConfig(
      ContractName.PriceFactory,
      chainId
    )

    // predict the price address
    const predictedPriceAddress =
      priceFactoryConfig.deployableContracts.Price.predictAddress({
        salt: input.salt,
        args: [input.owner],
      })

    const call = {
      to: priceFactoryConfig.address,
      data: encodeFunctionData({
        abi: priceFactoryConfig.abi,
        functionName: "deploy",
        args: [input.salt, input.owner],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedPriceAddress,
    }
  }

  /**
   * Create a set price call
   */
  static createSetPriceCall(priceContractAddress: Address, data: SetPriceData) {
    const call = {
      to: priceContractAddress,
      data: encodeFunctionData({
        abi: CONTRACT_ABI_MAPPING[ContractName.Price],
        functionName: "setPrice",
        args: [
          data.variationUId,
          {
            amount: data.amount,
            paymentToken: data.paymentToken,
          },
        ],
      }),
    }

    return {
      calls: [call],
    }
  }
}
