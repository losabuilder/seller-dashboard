import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk"
import { Call, encodeFunctionData, toBytes, toHex } from "viem"

import { getContractConfig } from "../config/contracts"
import { ContractName, SchemaName } from "../config/types"
import { getSchemaUID } from "../config/utils"

// Types for attestation data
export type ProductAttestationData = {
  productSalt: string
}

export type VariationAttestationData = {
  variationSalt: string
}

export type StoreCreationAttestationData = {
  storeSalt: string
}

export type OrderContractAttestationData = {
  orderContract: string
}

export type NameAttestationData = {
  name: string
}

export type DescriptionAttestationData = {
  descriptionContentHash: string
}

export type LogoAttestationData = {
  logoContentHash: string
}

export type WebsiteAttestationData = {
  website: string
}

export type EmailAttestationData = {
  email: string
}

export type MediaManifestAttestationData = {
  mediaManifestContentHash: `0x${string}`
}

export type ReturnWindowAttestationData = {
  returnWindowContentHash: `0x${string}`
}

export type ReturnPolicyAttestationData = {
  returnPolicyContentHash: `0x${string}`
}

export type ShippingCostTypeAttestationData = {
  shippingCostTypeContentHash: `0x${string}`
}

export type SkuAttestationData = {
  sku: string
}

export type UpcAttestationData = {
  upc: string
}

export type StoreIdAttestationData = {
  storeId: string
}

// Base attestation data structure
type BaseAttestationData = {
  refUID?: string
  recipient?: string
  revocable?: boolean
  expirationTime?: bigint
  value?: bigint
}

// Constants
const DEFAULT_ATTESTATION_CONFIG: BaseAttestationData = {
  refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
  recipient: "0x0000000000000000000000000000000000000000",
  revocable: true,
  expirationTime: 0n,
  value: 0n,
}

/**
 * Service for EAS attestations
 */
export class EASService {
  /**
   * Generic validation function that ensures required fields exist
   */
  private static validateRequired<T extends Record<string, unknown>>(
    data: T,
    requiredFields: (keyof T)[]
  ): asserts data is T {
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${String(field)} is required`)
      }
    }
  }

  /**
   * Create base attestation call with common configuration
   */
  private static createBaseAttestationCall(
    chainId: number,
    schemaName: SchemaName,
    encodedData: string,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    const config = getContractConfig(ContractName.EAS, chainId)
    const schema = getSchemaUID(schemaName, chainId)

    const configData = {
      ...DEFAULT_ATTESTATION_CONFIG,
      ...attestationData,
    }

    return {
      to: config.address,
      data: encodeFunctionData({
        abi: config.abi,
        functionName: "attest",
        args: [
          {
            schema,
            data: {
              data: encodedData as `0x${string}`,
              refUID: configData.refUID!,
              recipient: configData.recipient!,
              revocable: configData.revocable!,
              expirationTime: configData.expirationTime!,
              value: configData.value!,
            },
          },
        ],
      }),
    }
  }

  /**
   * Create a product attestation call
   */
  static createProductAttestationCall(
    chainId: number,
    schemaData: ProductAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["productSalt"])

    const schemaEncoder = new SchemaEncoder("bytes32 productSalt")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "productSalt",
        value: schemaData.productSalt,
        type: "bytes32",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.PRODUCT,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a variation attestation call
   */
  static createVariationAttestationCall(
    chainId: number,
    schemaData: VariationAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["variationSalt"])

    if (!attestationData?.refUID) {
      console.warn(
        "createVariationAttestationCall: Consider passing refUID in attestationData to link this variation to a product"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes32 variationSalt")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "variationSalt",
        value: schemaData.variationSalt,
        type: "bytes32",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.VARIATION,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a store creation attestation call
   */
  static createStoreCreationAttestationCall(
    chainId: number,
    schemaData: StoreCreationAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["storeSalt"])

    const schemaEncoder = new SchemaEncoder("bytes32 storeSalt")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "storeSalt",
        value: schemaData.storeSalt,
        type: "bytes32",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.STORE,
      encodedData,
      attestationData
    )
  }

  /**
   * Create an order contract attestation call
   */
  static createOrderContractAttestationCall(
    chainId: number,
    schemaData: OrderContractAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["orderContract"])

    if (!attestationData?.refUID) {
      console.warn(
        "createOrderContractAttestationCall: Consider passing refUID in attestationData to link this order contract to a store."
      )
    }

    const schemaEncoder = new SchemaEncoder("address orderContract")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "orderContract",
        value: schemaData.orderContract,
        type: "address",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.ORDER_CONTRACT,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a name attestation call
   */
  static createNameAttestationCall(
    chainId: number,
    schemaData: NameAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["name"])

    if (!attestationData?.refUID) {
      console.warn(
        "createNameAttestationCall: Consider passing refUID in attestationData to link this name to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("string name")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "name",
        value: schemaData.name,
        type: "string",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.NAME,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a description attestation call
   */
  static createDescriptionAttestationCall(
    chainId: number,
    schemaData: DescriptionAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["descriptionContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createDescriptionAttestationCall: Consider passing refUID in attestationData to link this description to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes descriptionContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "descriptionContentHash",
        value: schemaData.descriptionContentHash,
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.DESCRIPTION,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a logo attestation call
   */
  static createLogoAttestationCall(
    chainId: number,
    schemaData: LogoAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["logoContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createLogoAttestationCall: Consider passing refUID in attestationData to link this logo to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes logoContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "logoContentHash",
        value: toHex(toBytes(schemaData.logoContentHash)),
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.LOGO,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a website attestation call
   */
  static createWebsiteAttestationCall(
    chainId: number,
    schemaData: WebsiteAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["website"])

    if (!attestationData?.refUID) {
      console.warn(
        "createWebsiteAttestationCall: Consider passing refUID in attestationData to link this website to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("string website")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "website",
        value: schemaData.website,
        type: "string",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.WEBSITE,
      encodedData,
      attestationData
    )
  }

  /**
   * Create an email attestation call
   */
  static createEmailAttestationCall(
    chainId: number,
    schemaData: EmailAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["email"])

    if (!attestationData?.refUID) {
      console.warn(
        "createEmailAttestationCall: Consider passing refUID in attestationData to link this email to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("string email")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "email",
        value: schemaData.email,
        type: "string",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.EMAIL,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a media manifest attestation call
   */
  static createMediaManifestAttestationCall(
    chainId: number,
    schemaData: MediaManifestAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["mediaManifestContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createMediaManifestAttestationCall: Consider passing refUID in attestationData to link this media manifest to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes mediaManifestContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "mediaManifestContentHash",
        value: toHex(toBytes(schemaData.mediaManifestContentHash)),
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.MEDIA_MANIFEST,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a return window attestation call
   */
  static createReturnWindowAttestationCall(
    chainId: number,
    schemaData: ReturnWindowAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["returnWindowContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createReturnWindowAttestationCall: Consider passing refUID in attestationData to link this return window to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes returnWindowContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "returnWindowContentHash",
        value: schemaData.returnWindowContentHash,
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.RETURN_WINDOW,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a return policy attestation call
   */
  static createReturnPolicyAttestationCall(
    chainId: number,
    schemaData: ReturnPolicyAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["returnPolicyContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createReturnPolicyAttestationCall: Consider passing refUID in attestationData to link this return policy to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes returnPolicyContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "returnPolicyContentHash",
        value: schemaData.returnPolicyContentHash,
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.RETURN_POLICY,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a shipping cost type attestation call
   */
  static createShippingCostTypeAttestationCall(
    chainId: number,
    schemaData: ShippingCostTypeAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["shippingCostTypeContentHash"])

    if (!attestationData?.refUID) {
      console.warn(
        "createShippingCostTypeAttestationCall: Consider passing refUID in attestationData to link this shipping cost type to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("bytes shippingCostTypeContentHash")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "shippingCostTypeContentHash",
        value: schemaData.shippingCostTypeContentHash,
        type: "bytes",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.SHIPPING_COST_TYPE,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a sku attestation call
   */
  static createSkuAttestationCall(
    chainId: number,
    schemaData: SkuAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["sku"])

    if (!attestationData?.refUID) {
      console.warn(
        "createSkuAttestationCall: Consider passing refUID in attestationData to link this sku to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("string sku")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "sku",
        value: schemaData.sku,
        type: "string",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.SKU,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a upc attestation call
   */
  static createUpcAttestationCall(
    chainId: number,
    schemaData: UpcAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["upc"])

    if (!attestationData?.refUID) {
      console.warn(
        "createUpcAttestationCall: Consider passing refUID in attestationData to link this upc to another attestation"
      )
    }

    const schemaEncoder = new SchemaEncoder("string upc")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "upc",
        value: schemaData.upc,
        type: "string",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.UPC,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a store id attestation call
   */
  static createStoreIdAttestationCall(
    chainId: number,
    schemaData: StoreIdAttestationData,
    attestationData?: Partial<BaseAttestationData>
  ): Call {
    this.validateRequired(schemaData, ["storeId"])

    if (!attestationData?.refUID) {
      console.error(
        "createStoreIdAttestationCall: refUID is required, no sense in attesting store id without a reference. If you are attesting to create a store, you should use the store attestation call instead."
      )
      throw new Error("createStoreIdAttestationCall: refUID is required")
    }

    const schemaEncoder = new SchemaEncoder("bytes32 storeId")
    const encodedData = schemaEncoder.encodeData([
      {
        name: "storeId",
        value: schemaData.storeId,
        type: "bytes32",
      },
    ])

    return this.createBaseAttestationCall(
      chainId,
      SchemaName.STORE_ID,
      encodedData,
      attestationData
    )
  }

  /**
   * Create a revocation call for an existing attestation
   */
  static createRevokeAttestationCall(
    chainId: number,
    attestationUID: `0x${string}`,
    schemaId: `0x${string}`
  ): Call {
    const config = getContractConfig(ContractName.EAS, chainId)

    return {
      to: config.address,
      data: encodeFunctionData({
        abi: config.abi,
        functionName: "revoke",
        args: [
          {
            schema: schemaId,
            data: {
              uid: attestationUID,
              value: 0n,
            },
          },
        ],
      }),
    }
  }
}
