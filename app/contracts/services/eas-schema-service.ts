import { Address, encodeFunctionData, encodePacked, keccak256 } from "viem"

// configs
import { getContractConfig } from "../config/contracts"
import { ContractName } from "../config/types"
// abis
import { ORDER_PAID_SCHEMA_FACTORY_ABI } from "../abis/losa/factories/OrderPaidSchemaFactory"
import { ORDER_REFUNDED_SCHEMA_FACTORY_ABI } from "../abis/losa/factories/OrderRefundedSchemaFactory"
import { PLUGIN_RESOLVER_FACTORY_ABI } from "../abis/eas-plugin-resolvers/PluginResolverFactory"
// schemas
import { ORDER_PAID_SCHEMA } from "../schemas/OrderPaidSchema"
import { ORDER_REFUNDED_SCHEMA } from "../schemas/OrderRefundedSchema"
// services
import { PluginResolverService } from "./plugin-resolver-service"

type OrderPaidSchemaFactoryDeployParams = {
  owner: Address
  eas: Address
  schemaRegistry: Address
  salt: `0x${string}`
}

type OrderRefundedSchemaFactoryDeployParams = {
  owner: Address
  eas: Address
  schemaRegistry: Address
  salt: `0x${string}`
}

/**
 * Service for EAS schemas
 */
export class EASSchemaService {
  static predictSchemaUid(
    schema: string,
    resolverAddress: Address,
    revocable: boolean
  ): `0x${string}` {
    return keccak256(
      encodePacked(
        ["string", "address", "bool"],
        [schema, resolverAddress, revocable]
      )
    )
  }

  /**
   * Create an order paid schema
   */
  static createOrderPaidSchema(
    chainId: number,
    input: OrderPaidSchemaFactoryDeployParams
  ) {
    // predict the plugin resolver address
    const predictedPluginResolverAddress =
      PluginResolverService.predictPluginResolverAddress(chainId, {
        salt: input.salt,
        args: [input.owner, input.eas],
      })

    // get the order paid schema factory deploy call
    const config = getContractConfig<typeof ORDER_PAID_SCHEMA_FACTORY_ABI>(
      ContractName.OrderPaidSchemaFactory,
      chainId
    )

    const pluginResolverFactoryAddress = getContractConfig<
      typeof PLUGIN_RESOLVER_FACTORY_ABI
    >(ContractName.PluginResolverFactory, chainId).address

    const call = {
      to: config.address,
      data: encodeFunctionData({
        abi: config.abi,
        functionName: "deploy",
        args: [
          input.owner,
          input.eas,
          input.schemaRegistry,
          pluginResolverFactoryAddress,
          input.salt,
        ],
      }),
    }

    // predict the schema uid
    const schemaUid = this.predictSchemaUid(
      ORDER_PAID_SCHEMA,
      predictedPluginResolverAddress,
      true
    )

    return {
      calls: [call],
      predictedAddress: predictedPluginResolverAddress,
      predictedSchemaUid: schemaUid,
    }
  }

  /**
   * Create order refunded schema
   */
  static createOrderRefundedSchema(
    chainId: number,
    input: OrderRefundedSchemaFactoryDeployParams
  ) {
    // predict the plugin resolver address
    const predictedPluginResolverAddress =
      PluginResolverService.predictPluginResolverAddress(chainId, {
        salt: input.salt,
        args: [input.owner, input.eas],
      })

    // get the order refunded schema factory deploy call
    const config = getContractConfig<typeof ORDER_REFUNDED_SCHEMA_FACTORY_ABI>(
      ContractName.OrderRefundedSchemaFactory,
      chainId
    )

    const pluginResolverFactoryAddress = getContractConfig<
      typeof PLUGIN_RESOLVER_FACTORY_ABI
    >(ContractName.PluginResolverFactory, chainId).address

    const call = {
      to: config.address,
      data: encodeFunctionData({
        abi: config.abi,
        functionName: "deploy",
        args: [
          input.owner,
          input.eas,
          input.schemaRegistry,
          pluginResolverFactoryAddress,
          input.salt,
        ],
      }),
    }

    // predict the schema uid
    const schemaUid = this.predictSchemaUid(
      ORDER_REFUNDED_SCHEMA,
      predictedPluginResolverAddress,
      true
    )

    return {
      calls: [call],
      predictedAddress: predictedPluginResolverAddress,
      predictedSchemaUid: schemaUid,
    }
  }
}
