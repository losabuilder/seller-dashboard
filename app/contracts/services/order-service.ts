import { Address, encodeAbiParameters, encodeDeployData, encodeFunctionData } from "viem";



import { ORDER_ABI } from "../abis/losa/Order";
import { getFactoryChainConfig } from "../config/factories";
import { ContractName } from "../config/types";


export type CreateOrderContractInput = {
  owner: Address
  eas: Address
  priceContract: Address
  inventoryContract: Address
  orderSchema: `0x${string}`
  orderPaidSchema: `0x${string}`
  orderRefundedSchema: `0x${string}`
  validPaymentReceivers: Address[]
  salt: `0x${string}`
}

/**
 * Service for order contract interactions
 */
export class OrderService {
  /**
   * Create an order contract call
   */
  static createOrderContractCall(
    chainId: number,
    input: CreateOrderContractInput
  ) {
    const orderFactoryConfig = getFactoryChainConfig(
      ContractName.OrderFactory,
      chainId
    )

    console.log("salt", input.salt)
    console.log("owner", input.owner)
    console.log("eas", input.eas)
    console.log("priceContract", input.priceContract)
    console.log("inventoryContract", input.inventoryContract)
    console.log("orderSchema", input.orderSchema)
    console.log("orderPaidSchema", input.orderPaidSchema)
    console.log("orderRefundedSchema", input.orderRefundedSchema)
    console.log("validPaymentReceivers", input.validPaymentReceivers)

    const constructorAbi = orderFactoryConfig.deployableContracts.Order
      .constructorAbi
    console.log("constructorAbi:", constructorAbi)
    const bytecode = orderFactoryConfig.deployableContracts.Order
      .bytecode

    const deployData = encodeDeployData({
      abi: constructorAbi,
      bytecode,
      args: [
        input.owner,
        input.eas,
        input.priceContract,
        input.inventoryContract,
        input.orderSchema,
        input.orderPaidSchema,
        input.orderRefundedSchema,
        input.validPaymentReceivers,
      ],
    })

    console.log("deployData", deployData)

    const abiEncodePackedConstructorArgs = encodeAbiParameters(constructorAbi[0].inputs, [
      input.owner,
      input.eas,
      input.priceContract,
      input.inventoryContract,
      input.orderSchema,
      input.orderPaidSchema,
      input.orderRefundedSchema,
      input.validPaymentReceivers,
    ])
    console.log("abiEncodePackedConstructorArgs", abiEncodePackedConstructorArgs)

    // predict the order address
    const predictedOrderAddress =
      orderFactoryConfig.deployableContracts.Order.predictAddress({
        salt: input.salt,
        args: [
          input.owner,
          input.eas,
          input.priceContract,
          input.inventoryContract,
          input.orderSchema,
          input.orderPaidSchema,
          input.orderRefundedSchema,
          input.validPaymentReceivers,
        ],
      })

    const call = {
      to: orderFactoryConfig.address,
      data: encodeFunctionData({
        abi: orderFactoryConfig.abi,
        functionName: "deploy",
        args: [
          input.owner,
          input.eas,
          input.priceContract,
          input.inventoryContract,
          input.orderSchema,
          input.orderPaidSchema,
          input.orderRefundedSchema,
          input.validPaymentReceivers,
          input.salt,
        ],
      }),
    }
    console.log('order contract creation call:', call)

    return {
      calls: [call],
      predictedAddress: predictedOrderAddress,
    }
  }

  /**
   * add before order plugin to order
   */
  static addBeforeOrderPluginContractCall(
    orderContractAddress: Address,
    pluginAddress: Address
  ) {
    const call = {
      to: orderContractAddress,
      data: encodeFunctionData({
        abi: ORDER_ABI,
        functionName: "addBeforeOrderPlugin",
        args: [pluginAddress],
      }),
    }
    return {
      calls: [call],
    }
  }
}
