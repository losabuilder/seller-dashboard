import { Address, Call, encodeFunctionData } from "viem"

import { getFactoryChainConfig } from "../config/factories"
import { CONTRACT_ABI_MAPPING, ContractName } from "../config/types"

export type UpdateAvailableQuantityData = {
  variationUId: `0x${string}`
  inventory: number
}

export type CreateInventoryContractInput = {
  salt: `0x${string}`
  owner: Address
}

/**
 * Service for inventory contract interactions
 */
export class InventoryService {
  /**
   * Create an inventory contract call
   */
  static createInventoryContractCall(
    chainId: number,
    input: CreateInventoryContractInput
  ) {
    const inventoryFactoryConfig = getFactoryChainConfig(
      ContractName.InventoryFactory,
      chainId
    )

    // predict the inventory address
    const predictedInventoryAddress =
      inventoryFactoryConfig.deployableContracts.Inventory.predictAddress({
        salt: input.salt,
        args: [input.owner],
      })

    const call = {
      to: inventoryFactoryConfig.address,
      data: encodeFunctionData({
        abi: inventoryFactoryConfig.abi,
        functionName: "deploy",
        args: [input.salt, input.owner],
      }),
    }

    return {
      calls: [call],
      predictedAddress: predictedInventoryAddress,
    }
  }

  /**
   * Create an add allowed updater call
   */
  static createAddAllowedUpdaterCall(
    inventoryAddress: Address,
    updaterAddress: Address
  ): { calls: Call[] } {
    const call = {
      to: inventoryAddress,
      data: encodeFunctionData({
        abi: CONTRACT_ABI_MAPPING[ContractName.Inventory],
        functionName: "addAllowedUpdater",
        args: [updaterAddress],
      }),
    }

    return {
      calls: [call],
    }
  }

  /**
   * Create a update available quantity call
   * The first argument is the variation UId
   * The second argument is to set a custom quantity for a specific buyer (not implemented)
   * The third argument is the available quantity
   */
  static createUpdateAvailableQuantityCall(
    inventoryContractAddress: Address,
    data: UpdateAvailableQuantityData
  ): { calls: Call[] } {
    const call = {
      to: inventoryContractAddress,
      data: encodeFunctionData({
        abi: CONTRACT_ABI_MAPPING[ContractName.Inventory],
        functionName: "updateAvailableQuantity",
        args: [
          data.variationUId,
          "0x0000000000000000000000000000000000000000",
          BigInt(data.inventory),
        ],
      }),
    }

    return {
      calls: [call],
    }
  }
}
