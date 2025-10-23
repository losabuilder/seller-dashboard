"use client"

import { useState } from "react"
import { generateSaltFromKey } from "@/utils/create2"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { Address, Call } from "viem"
import { useChainId } from "wagmi"
import { getTransactionReceipt } from "wagmi/actions"

import { StorachaService } from "../../services/storacha-service"
import { tryGetContractConfig } from "../config/contracts"
import { CHAIN_CONFIG } from "../config/generated-chain-config"
import { ContractName, SchemaName } from "../config/types"
import { getSchemaUID } from "../config/utils"
import { wagmiConfig } from "../config/wagmi-config"
import { useTransactionExecutor } from "../hooks/useTransactionExecutor"
import { EASSchemaService } from "../services/eas-schema-service"
import { EASService } from "../services/eas-service"
import { InventoryService } from "../services/inventory-service"
import {
  CreateOrderContractInput,
  OrderService,
} from "../services/order-service"
import { PluginResolverService } from "../services/plugin-resolver-service"
import {
  CreateDecreaseInventoryContractInput,
  DecreaseInventoryPluginService,
} from "../services/plugins/decrease-inventory-plugin-service"
import {
  CreateOperatorAllowlistContractInput,
  OperatorAllowlistPluginService,
} from "../services/plugins/operator-allowlist-plugin-service"
import {
  CreatePauseProductContractInput,
  PauseProductPluginService,
} from "../services/plugins/pause-product-plugin-service"
import {
  CreatePreventDoublePayingContractInput,
  PreventDoublePayingPluginService,
} from "../services/plugins/prevent-double-paying-plugin-service"
import {
  CreateUpdatePricePluginsAfterOrderContractInput,
  UpdatePricePluginsAfterOrderPluginService,
} from "../services/plugins/update-price-plugins-after-order-service"
import {
  CreateUpdatePricePluginsAfterRefundContractInput,
  UpdatePricePluginsAfterRefundPluginService,
} from "../services/plugins/update-price-plugins-after-refund-service"
import { PriceService } from "../services/price-service"
import { TransactionBuilder } from "../services/transaction-builder"

export type StoreCreationInput = {
  name: string
  description?: string
  logoContentHash?: `0x${string}` | null
  email?: string
  website?: string
}

export enum StoreCreationStep {
  IDLE = "idle",
  COMPLETED = "completed",
  ERROR = "error",
}

type PluginParamsMap = {
  [ContractName.PreventDoublePayingPlugin]: Partial<CreatePreventDoublePayingContractInput>
  [ContractName.DecreaseInventoryPlugin]: Partial<CreateDecreaseInventoryContractInput>
  [ContractName.UpdatePricePluginsAfterOrderPlugin]: Partial<CreateUpdatePricePluginsAfterOrderContractInput>
  [ContractName.UpdatePricePluginsAfterRefundPlugin]: Partial<CreateUpdatePricePluginsAfterRefundContractInput>
  [ContractName.OperatorAllowlistBeforeOrderPlugin]: Partial<CreateOperatorAllowlistContractInput>
  [ContractName.PauseProductBeforeOrderPlugin]: Partial<CreatePauseProductContractInput>
}

export function useStoreCreationWorkflow() {
  const { client } = useSmartWallets()
  const smartWalletAddress = client?.account.address as `0x${string}`
  const chainId = useChainId()
  const easAddress = tryGetContractConfig(ContractName.EAS, chainId)?.address
  const schemaRegistryAddress = tryGetContractConfig(
    ContractName.SchemaRegistry,
    chainId
  )?.address
  const { executeTransaction } = useTransactionExecutor()

  // state
  const [currentStep, setCurrentStep] = useState<StoreCreationStep>(
    StoreCreationStep.IDLE
  )

  const createStoreAttestation = async (): Promise<`0x${string}`> => {
    let storeSalt: string | undefined
    try {
      // Validate inputs
      if (!smartWalletAddress) {
        throw new Error("Smart wallet address is required")
      }
      if (!chainId) {
        throw new Error("Chain ID is required")
      }

      const txBuilder = new TransactionBuilder()
      storeSalt = generateSaltFromKey(smartWalletAddress, "store")

      const storeAttestationCall =
        EASService.createStoreCreationAttestationCall(chainId, { storeSalt })
      txBuilder.addCall(storeAttestationCall)

      const txHash = await executeTransaction(txBuilder.getCalls())
      if (!txHash) {
        throw new Error(
          "Transaction execution failed - no transaction hash returned"
        )
      }

      // Get receipt with timeout and retries
      const receipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      })

      if (!receipt?.logs) {
        throw new Error(
          `Transaction succeeded but no logs found. Hash: ${txHash}`
        )
      }

      // Find EAS logs
      const easLogs = receipt.logs.filter((log) => log.address === easAddress)
      if (easLogs.length === 0) {
        throw new Error(`No EAS logs found in transaction. Hash: ${txHash}`)
      }

      // Look for store schema attestation
      const storeSchemaUID = getSchemaUID(SchemaName.STORE, chainId)
      const storeAttestationLog = easLogs.find(
        (log) => log.topics[3] === storeSchemaUID
      )

      if (!storeAttestationLog?.data) {
        throw new Error(
          `Store attestation log not found. Expected schema: ${storeSchemaUID}. Hash: ${txHash}`
        )
      }

      console.log("Store attestation UID:", storeAttestationLog.data)
      return storeAttestationLog.data
    } catch (error) {
      // Enhanced error context
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const context = {
        function: "createStoreAttestation",
        smartWalletAddress,
        chainId,
        storeSalt,
      }

      console.error("Store attestation failed:", {
        error: errorMessage,
        context,
      })
      throw new Error(`Store attestation failed: ${errorMessage}`)
    }
  }

  const uploadStoreDescription = async (
    description: string
  ): Promise<`0x${string}`> => {
    try {
      const result = await StorachaService.uploadText(description)
      console.log("Store description uploaded to Storacha:", result.cid)
      return result.contentHash
    } catch (error) {
      console.error("Failed to upload store description to Storacha:", error)
      throw new Error("Failed to upload store description to IPFS")
    }
  }

  const createMarkOrderPaidSchema = (): {
    calls: Call[]
    markOrderPaidPluginResolverAddress: Address
    orderPaidSchemaUid: `0x${string}`
  } => {
    if (!easAddress || !schemaRegistryAddress) {
      throw new Error(
        "EAS or schema registry address not found. Make sure you are connected to the correct network."
      )
    }
    const owner = smartWalletAddress
    const salt = generateSaltFromKey(owner, "markOrderPaidSchema")
    // create the schema
    const { calls, predictedAddress, predictedSchemaUid } =
      EASSchemaService.createOrderPaidSchema(chainId, {
        owner,
        eas: easAddress,
        schemaRegistry: schemaRegistryAddress,
        salt,
      })
    return {
      calls,
      markOrderPaidPluginResolverAddress: predictedAddress,
      orderPaidSchemaUid: predictedSchemaUid,
    }
  }

  const createOrderRefundedSchema = (): {
    calls: Call[]
    orderRefundedPluginResolverAddress: Address
    orderRefundedSchemaUid: `0x${string}`
  } => {
    if (!easAddress || !schemaRegistryAddress) {
      throw new Error(
        "EAS or schema registry address not found. Make sure you are connected to the correct network."
      )
    }
    const owner = smartWalletAddress
    const salt = generateSaltFromKey(owner, "orderRefundedSchema")
    // create the schema
    const { calls, predictedAddress, predictedSchemaUid } =
      EASSchemaService.createOrderRefundedSchema(chainId, {
        owner,
        eas: easAddress,
        schemaRegistry: schemaRegistryAddress,
        salt,
      })

    return {
      calls,
      orderRefundedPluginResolverAddress: predictedAddress,
      orderRefundedSchemaUid: predictedSchemaUid,
    }
  }

  const createResolverPlugin = <T extends keyof PluginParamsMap>(
    plugin: T,
    customParams: PluginParamsMap[T]
  ): {
    calls: Call[]
    address: Address
  } => {
    if (!easAddress) {
      throw new Error(
        "EAS address not found. Make sure you are connected to the correct network."
      )
    }
    switch (plugin) {
      case ContractName.PreventDoublePayingPlugin: {
        const defaultParams: CreatePreventDoublePayingContractInput = {
          owner: smartWalletAddress,
          salt: generateSaltFromKey(
            smartWalletAddress,
            "preventDoublePayingPlugin"
          ),
        }
        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreatePreventDoublePayingContractInput
        const { calls, predictedAddress } =
          PreventDoublePayingPluginService.createPreventDoublePayingContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }
      case ContractName.DecreaseInventoryPlugin: {
        const defaultParams: CreateDecreaseInventoryContractInput = {
          inventoryContract: "0x0", // placeholder
          eas: easAddress,
          salt: generateSaltFromKey(
            smartWalletAddress,
            "decreaseInventoryPlugin"
          ),
        }

        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreateDecreaseInventoryContractInput
        const { calls, predictedAddress } =
          DecreaseInventoryPluginService.createDecreaseInventoryContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }
      case ContractName.UpdatePricePluginsAfterOrderPlugin: {
        const defaultParams: CreateUpdatePricePluginsAfterOrderContractInput = {
          priceContract: "0x0", // placeholder
          eas: easAddress,
          salt: generateSaltFromKey(
            smartWalletAddress,
            "updatePricePluginsAfterOrderPlugin"
          ),
        }
        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreateUpdatePricePluginsAfterOrderContractInput
        const { calls, predictedAddress } =
          UpdatePricePluginsAfterOrderPluginService.createUpdatePricePluginsAfterOrderContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }
      case ContractName.UpdatePricePluginsAfterRefundPlugin: {
        const defaultParams: CreateUpdatePricePluginsAfterRefundContractInput =
          {
            priceContract: "0x0", // placeholder
            eas: easAddress,
            salt: generateSaltFromKey(
              smartWalletAddress,
              "updatePricePluginsAfterRefundPlugin"
            ),
          }
        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreateUpdatePricePluginsAfterRefundContractInput
        const { calls, predictedAddress } =
          UpdatePricePluginsAfterRefundPluginService.createUpdatePricePluginsAfterRefundContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }
      case ContractName.OperatorAllowlistBeforeOrderPlugin: {
        const defaultParams: CreateOperatorAllowlistContractInput = {
          owner: smartWalletAddress,
          allowedOperators: [smartWalletAddress],
          defaultMaxFeeBps: 1000,
          defaultMinRefundExpiry: 2592000,
          defaultMaxRefundExpiry: 5184000,
          salt: generateSaltFromKey(
            smartWalletAddress,
            "operatorAllowlistBeforeOrderPlugin"
          ),
        }
        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreateOperatorAllowlistContractInput
        const { calls, predictedAddress } =
          OperatorAllowlistPluginService.createOperatorAllowlistContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }
      case ContractName.PauseProductBeforeOrderPlugin: {
        const defaultParams: CreatePauseProductContractInput = {
          owner: smartWalletAddress,
          salt: generateSaltFromKey(
            smartWalletAddress,
            "pauseProductBeforeOrderPlugin"
          ),
        }
        const finalParams = {
          ...defaultParams,
          ...customParams,
        } as CreatePauseProductContractInput
        const { calls, predictedAddress } =
          PauseProductPluginService.createPauseProductContractCall(
            chainId,
            finalParams
          )
        return { calls, address: predictedAddress }
      }

      default:
        throw new Error(`Plugin ${plugin} not supported`)
    }
  }

  const createPriceContract = (): {
    calls: Call[]
    priceAddress: Address
  } => {
    const owner = smartWalletAddress
    const salt = generateSaltFromKey(owner, "priceContract")
    const { calls, predictedAddress: priceAddress } =
      PriceService.createPriceContractCall(chainId, {
        salt,
        owner,
      })
    return { calls, priceAddress }
  }

  const createInventoryContract = (): {
    calls: Call[]
    inventoryAddress: Address
  } => {
    const owner = smartWalletAddress
    const salt = generateSaltFromKey(owner, "inventoryContract")
    const { calls, predictedAddress: inventoryAddress } =
      InventoryService.createInventoryContractCall(chainId, {
        salt,
        owner,
      })
    return { calls, inventoryAddress }
  }

  const createOrderContract = (
    input: Omit<CreateOrderContractInput, "salt">
  ): {
    calls: Call[]
    orderAddress: Address
  } => {
    const owner = smartWalletAddress
    const salt = generateSaltFromKey(owner, "orderContract")
    const { calls, predictedAddress: orderAddress } =
      OrderService.createOrderContractCall(chainId, {
        ...input,
        salt,
      })
    return { calls, orderAddress }
  }

  const createStore = async (
    data: StoreCreationInput
  ): Promise<{
    storeId: `0x${string}`
    orderContract: Address
    orderPaidSchema: `0x${string}`
  }> => {
    console.log("store creation data:", data)

    if (!easAddress) {
      throw new Error(
        "EAS address not found. Make sure you are connected to the correct network."
      )
    }

    const txBuilder = new TransactionBuilder()

    ///////////////////////////////// Schemas /////////////////////////////////

    // create mark order paid schema
    const {
      calls: markOrderPaidCalls,
      markOrderPaidPluginResolverAddress,
      orderPaidSchemaUid,
    } = createMarkOrderPaidSchema()

    txBuilder.addCalls(markOrderPaidCalls)

    // create refund order schema
    const {
      calls: orderRefundedCalls,
      orderRefundedPluginResolverAddress,
      orderRefundedSchemaUid,
    } = createOrderRefundedSchema()

    txBuilder.addCalls(orderRefundedCalls)

    ///////////////////////////////// Core /////////////////////////////////

    // create price contract
    const { calls: priceCalls, priceAddress } = createPriceContract()

    txBuilder.addCalls(priceCalls)

    // create inventory contract
    const { calls: inventoryCalls, inventoryAddress } =
      createInventoryContract()

    txBuilder.addCalls(inventoryCalls)

    // create order contract
    const orderSchema =
      CHAIN_CONFIG[chainId.toString() as keyof typeof CHAIN_CONFIG].schemas
        .Order
    if (!orderSchema) {
      throw new Error("Order schema not found")
    }
    const { calls: orderCalls, orderAddress } = createOrderContract({
      owner: smartWalletAddress,
      eas: easAddress,
      priceContract: priceAddress,
      inventoryContract: inventoryAddress,
      orderSchema,
      orderPaidSchema: orderPaidSchemaUid,
      orderRefundedSchema: orderRefundedSchemaUid,
      validPaymentReceivers: [smartWalletAddress],
    })

    txBuilder.addCalls(orderCalls)

    ///////////////////////////////// Plugins /////////////////////////////////

    // mark order paid plugins

    // validating
    const validatingPlugins = [ContractName.PreventDoublePayingPlugin]
    validatingPlugins.forEach((vPlugin) => {
      // create the plugin
      const { calls: createPluginCalls, address } = createResolverPlugin(
        vPlugin as keyof PluginParamsMap,
        {}
      )

      // add the plugin to the resolver
      const { calls: addPluginCalls } =
        PluginResolverService.addValidatingResolverCall(
          markOrderPaidPluginResolverAddress,
          address
        )

      // add the calls to the transaction builder
      txBuilder.addCalls([...createPluginCalls, ...addPluginCalls])
    })

    // executing
    const executingPlugins = [
      ContractName.DecreaseInventoryPlugin,
      ContractName.UpdatePricePluginsAfterOrderPlugin,
    ]
    let decreaseInventoryPluginAddress: Address
    executingPlugins.forEach((ePlugin) => {
      // create the plugin
      const { calls: createPluginCalls, address } = createResolverPlugin(
        ePlugin as keyof PluginParamsMap,
        {
          inventoryContract: inventoryAddress,
          priceContract: priceAddress,
        }
      )

      // add the plugin to the resolver
      const { calls: addPluginCalls } =
        PluginResolverService.addExecutingResolverCall(
          markOrderPaidPluginResolverAddress,
          address
        )

      // add the calls to the transaction builder
      txBuilder.addCalls([...createPluginCalls, ...addPluginCalls])

      if (ePlugin === ContractName.DecreaseInventoryPlugin) {
        decreaseInventoryPluginAddress = address
      }
    })

    // order refunded plugins

    // executing

    const orderRefundedExecutingPlugins = [
      ContractName.UpdatePricePluginsAfterRefundPlugin,
    ]
    orderRefundedExecutingPlugins.forEach((ePlugin) => {
      // create the plugin
      const { calls: createPluginCalls, address } = createResolverPlugin(
        ePlugin as keyof PluginParamsMap,
        {
          priceContract: priceAddress,
        }
      )
      // add the plugin to the resolver
      const { calls: addPluginCalls } =
        PluginResolverService.addExecutingResolverCall(
          orderRefundedPluginResolverAddress,
          address
        )

      // add the calls to the transaction builder
      txBuilder.addCalls([...createPluginCalls, ...addPluginCalls])
    })

    // Before Order Plugins

    // reference:
    // new OperatorAllowlistBeforeOrderPlugin(
    //   sellerOne, // owner
    //   allowedOperators, // allowed operators
    //   1000, // default max fee bps (10%)
    //   2592000, // default min refund expiry (30 days)
    //   5184000 // default max refund expiry (60 days)
    // )

    const beforeOrderPlugins = [
      ContractName.OperatorAllowlistBeforeOrderPlugin,
      ContractName.PauseProductBeforeOrderPlugin,
    ]
    beforeOrderPlugins.forEach((plugin) => {
      // create the plugin
      const { calls: createPluginCalls, address } = createResolverPlugin(
        plugin as keyof PluginParamsMap,
        {
          // todo: add losa operator to list of allowed operators
        }
      )
      // add the plugin to the resolver
      const { calls: addPluginCalls } =
        OrderService.addBeforeOrderPluginContractCall(orderAddress, address)

      // add the calls to the transaction builder
      txBuilder.addCalls([...createPluginCalls, ...addPluginCalls])
    })

    ///////////////////////////////// Update Core contracts to accept calls from the plugins /////////////////////////////////
    const { calls: addAllowedUpdaterCalls } =
      InventoryService.createAddAllowedUpdaterCall(
        inventoryAddress,
        decreaseInventoryPluginAddress!
      )
    txBuilder.addCalls(addAllowedUpdaterCalls)

    ///////////////////////////////// attestations /////////////////////////////////

    // Run store attestation and description upload concurrently since they're independent
    const [storeAttestationUid, descriptionContentHash] = await Promise.all([
      createStoreAttestation(),
      data.description
        ? uploadStoreDescription(data.description)
        : Promise.resolve(undefined),
    ])
    console.log("storeAttestationUid:", storeAttestationUid)
    console.log("descriptionContentHash:", descriptionContentHash)

    // order contract attestation
    const orderContractAttestationCall =
      EASService.createOrderContractAttestationCall(
        chainId,
        {
          orderContract: orderAddress,
        },
        { refUID: storeAttestationUid }
      )
    txBuilder.addCall(orderContractAttestationCall)

    // name attestation
    if (data.name) {
      const nameAttestationCall = EASService.createNameAttestationCall(
        chainId,
        {
          name: data.name,
        },
        { refUID: storeAttestationUid }
      )
      txBuilder.addCall(nameAttestationCall)
    }

    // description attestation
    if (descriptionContentHash) {
      const descriptionAttestationCall =
        EASService.createDescriptionAttestationCall(
          chainId,
          {
            descriptionContentHash,
          },
          { refUID: storeAttestationUid }
        )
      txBuilder.addCall(descriptionAttestationCall)
    }

    // logo attestation
    if (data.logoContentHash) {
      const logoAttestationCall = EASService.createLogoAttestationCall(
        chainId,
        {
          logoContentHash: data.logoContentHash,
        },
        { refUID: storeAttestationUid }
      )
      txBuilder.addCall(logoAttestationCall)
    }

    // email attestation
    if (data.email) {
      const emailAttestationCall = EASService.createEmailAttestationCall(
        chainId,
        {
          email: data.email,
        },
        { refUID: storeAttestationUid }
      )
      txBuilder.addCall(emailAttestationCall)
    }

    // website attestation
    if (data.website) {
      const websiteAttestationCall = EASService.createWebsiteAttestationCall(
        chainId,
        {
          website: data.website,
        },
        { refUID: storeAttestationUid }
      )
      txBuilder.addCall(websiteAttestationCall)
    }

    // Execute transaction
    const txHash = await executeTransaction(txBuilder.getCalls())
    console.log("txHash:", txHash)
    if (!txHash) {
      setCurrentStep(StoreCreationStep.ERROR)
      throw new Error("Failed to create store")
    }
    // get the receipt')
    const receipt = await getTransactionReceipt(wagmiConfig, {
      hash: txHash as `0x${string}`,
    })
    console.log("Transaction receipt:", receipt)

    setCurrentStep(StoreCreationStep.COMPLETED)
    // placeholder return
    return {
      storeId: storeAttestationUid,
      orderContract: orderAddress,
      orderPaidSchema: orderPaidSchemaUid,
    }
  }

  return {
    createStore,
    currentStep,
  }
}
