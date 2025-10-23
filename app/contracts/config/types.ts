import { Abi, Address } from "viem";
import { base, baseSepolia, mainnet } from "viem/chains";



// ABI imports
import { EAS_ABI } from "../abis/eas/EAS";
import { EAS_SCHEMA_REGISTRY_ABI } from "../abis/eas/EASSchemaRegistry";
import { INVENTORY_ABI } from "../abis/losa/Inventory";
import { INVENTORY_FACTORY_ABI } from "../abis/losa/factories/InventoryFactory";
import { ORDER_ABI } from "../abis/losa/Order";
import { ORDER_FACTORY_ABI } from "../abis/losa/factories/OrderFactory";
import { ORDER_PAID_SCHEMA_FACTORY_ABI } from "../abis/losa/factories/OrderPaidSchemaFactory";
import { ORDER_REFUNDED_SCHEMA_FACTORY_ABI } from "../abis/losa/factories/OrderRefundedSchemaFactory";
import { PLUGIN_RESOLVER_ABI } from "../abis/eas-plugin-resolvers/PluginResolver";
import { PLUGIN_RESOLVER_FACTORY_ABI } from "../abis/eas-plugin-resolvers/PluginResolverFactory";
import { OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_FACTORY_ABI } from "../abis/Plugins/BeforeOrderPlugins/factories/OperatorAllowlistBeforeOrderPluginFactory";
import { PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_FACTORY_ABI } from "../abis/Plugins/BeforeOrderPlugins/factories/PauseProductBeforeOrderPluginFactory";
import { OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_ABI } from "../abis/Plugins/BeforeOrderPlugins/OperatorAllowlistBeforeOrderPlugin";
import { PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_ABI } from "../abis/Plugins/BeforeOrderPlugins/PauseProductBeforeOrderPlugin";
import { DECREASE_INVENTORY_PLUGIN_ABI } from "../abis/Plugins/PluginResolvers/DecreaseInventoryPlugin";
import { DECREASE_INVENTORY_PLUGIN_FACTORY_ABI } from "../abis/Plugins/PluginResolvers/factories/DecreaseInventoryPluginFactory";
import { PREVENT_DOUBLE_PAYING_PLUGIN_FACTORY_ABI } from "../abis/Plugins/PluginResolvers/factories/PreventDoublePayingPluginFactory";
import { UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_FACTORY_ABI } from "../abis/Plugins/PluginResolvers/factories/UpdatePricePluginsAfterOrderPluginFactory";
import { UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_FACTORY_ABI } from "../abis/Plugins/PluginResolvers/factories/UpdatePricePluginsAfterRefundPluginFactory";
import { PREVENT_DOUBLE_PAYING_PLUGIN_ABI } from "../abis/Plugins/PluginResolvers/PreventDoublePayingPlugin";
import { UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_ABI } from "../abis/Plugins/PluginResolvers/UpdatePricePluginsAfterOrderPlugin";
import { UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_ABI } from "../abis/Plugins/PluginResolvers/UpdatePricePluginsAfterRefundPlugin";
import { PRICE_WITH_PLUGINS_ABI } from "../abis/losa/PriceWithPlugins";
import { PRICE_WITH_PLUGINS_FACTORY_ABI } from "../abis/losa/factories/PriceWithPluginsFactory";
// bytecode imports
// import { ORDER_PAID_SCHEMA_FACTORY_BYTECODE } from '../bytecodes/OrderPaidSchemaFactory';
import { PLUGIN_RESOLVER_BYTECODE } from "../bytecodes/eas-plugin-resolvers/PluginResolverBytecode";
import { INVENTORY_BYTECODE } from "../bytecodes/losa/Inventory.bytecode";
import { ORDER_BYTECODE } from "../bytecodes/losa/Order.bytecode";
import { OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/BeforeOrderPlugins/OperatorAllowlistBeforeOrderPlugin.bytecode";
import { PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/BeforeOrderPlugins/PauseProductBeforeOrderPlugin.bytecode";
import { DECREASE_INVENTORY_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/PluginResolvers/DecreaseInventoryPlugin.bytecode";
import { PREVENT_DOUBLE_PAYING_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/PluginResolvers/PreventDoublePayingPlugin.bytecode";
import { UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/PluginResolvers/UpdatePricePluginsAfterOrderPlugin.bytecode";
import { UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_BYTECODE } from "../bytecodes/losa/Plugins/PluginResolvers/UpdatePricePluginsAfterRefundPlugin.bytecode";
import { PRICE_WITH_PLUGINS_BYTECODE } from "../bytecodes/losa/PriceWithPlugins.bytecode";


// ============================================================================
// CHAIN CONFIGURATION
// ============================================================================

// Define all chains we support with their metadata
export const CHAIN_CONFIG_MAP = {
  anvil: {
    name: "anvil",
    id: 31337,
    chain: {
      id: 31337,
      name: "Anvil",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
    },
    envSuffix: "anvil",
  },
  baseSepolia: {
    name: "baseSepolia",
    id: 84532,
    chain: baseSepolia,
    envSuffix: "baseSepolia",
  },
  base: {
    name: "base",
    id: 8453,
    chain: base,
    envSuffix: "base",
  },
  mainnet: {
    name: "mainnet",
    id: 1,
    chain: mainnet,
    envSuffix: "mainnet",
  },
} as const

// Extract useful derived types and values
export type ChainConfigKey = keyof typeof CHAIN_CONFIG_MAP
export const ALL_CHAIN_NAMES = Object.keys(CHAIN_CONFIG_MAP) as ChainConfigKey[]
export const ALL_CHAIN_IDS = Object.values(CHAIN_CONFIG_MAP).map(
  (config) => config.id
)
export const ALL_CHAINS = Object.values(CHAIN_CONFIG_MAP).map(
  (config) => config.chain
)

// Active chains - easily enable/disable chains by commenting out
export const ACTIVE_CHAINS: ChainConfigKey[] = [
  // "anvil",
  "baseSepolia",
  // "base",
  // 'mainnet',  // Uncomment when ready
]

// Get active chain objects for contracts.ts - ensure at least one chain is always present
export const ACTIVE_CHAIN_OBJECTS = ACTIVE_CHAINS.map(
  (name) => CHAIN_CONFIG_MAP[name].chain
) as [
  (typeof CHAIN_CONFIG_MAP)[ChainConfigKey]["chain"],
  ...(typeof CHAIN_CONFIG_MAP)[ChainConfigKey]["chain"][],
]

// Get chain name to ID mapping for build script
export const CHAIN_NAME_TO_ID = Object.fromEntries(
  Object.entries(CHAIN_CONFIG_MAP).map(([name, config]) => [name, config.id])
)

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================

// Define available contract names as a union type
export enum ContractName {
  // general contracts
  EAS = "EAS",
  SchemaRegistry = "SchemaRegistry",
  ////////// LOSA Factories //////////
  // schemas and schema plugin resolvers
  OrderPaidSchemaFactory = "OrderPaidSchemaFactory",
  OrderRefundedSchemaFactory = "OrderRefundedSchemaFactory",
  PluginResolverFactory = "PluginResolverFactory",
  // core
  PriceFactory = "PriceFactory",
  InventoryFactory = "InventoryFactory",
  OrderFactory = "OrderFactory",
  // plugins
  // plugin resolvers
  PreventDoublePayingPluginFactory = "PreventDoublePayingPluginFactory",
  DecreaseInventoryPluginFactory = "DecreaseInventoryPluginFactory",
  UpdatePricePluginsAfterOrderPluginFactory = "UpdatePricePluginsAfterOrderPluginFactory",
  UpdatePricePluginsAfterRefundPluginFactory = "UpdatePricePluginsAfterRefundPluginFactory",
  // before order plugins
  OperatorAllowlistBeforeOrderPluginFactory = "OperatorAllowlistBeforeOrderPluginFactory",
  PauseProductBeforeOrderPluginFactory = "PauseProductBeforeOrderPluginFactory",
  ////////// LOSA Contracts //////////
  // schemas and schema plugin resolvers
  PluginResolver = "PluginResolver",
  MarkOrderPaidSchemaResolver = "MarkOrderPaidSchemaResolver",
  // core
  Price = "Price",
  Inventory = "Inventory",
  Order = "Order",
  // plugins
  // plugin resolvers
  PreventDoublePayingPlugin = "PreventDoublePayingPlugin",
  DecreaseInventoryPlugin = "DecreaseInventoryPlugin",
  UpdatePricePluginsAfterOrderPlugin = "UpdatePricePluginsAfterOrderPlugin",
  UpdatePricePluginsAfterRefundPlugin = "UpdatePricePluginsAfterRefundPlugin",
  // before order plugins
  OperatorAllowlistBeforeOrderPlugin = "OperatorAllowlistBeforeOrderPlugin",
  PauseProductBeforeOrderPlugin = "PauseProductBeforeOrderPlugin",
  // Add more contract names as needed
}

// ABI mappings for contracts - single source of truth!
export const CONTRACT_ABI_MAPPING = {
  // general contracts
  [ContractName.EAS]: EAS_ABI,
  [ContractName.SchemaRegistry]: EAS_SCHEMA_REGISTRY_ABI,
  ////////// LOSA Factories //////////
  // schemas and schema plugin resolver
  [ContractName.OrderPaidSchemaFactory]: ORDER_PAID_SCHEMA_FACTORY_ABI,
  [ContractName.OrderRefundedSchemaFactory]: ORDER_REFUNDED_SCHEMA_FACTORY_ABI,
  [ContractName.PluginResolverFactory]: PLUGIN_RESOLVER_FACTORY_ABI,
  // core
  [ContractName.PriceFactory]: PRICE_WITH_PLUGINS_FACTORY_ABI,
  [ContractName.InventoryFactory]: INVENTORY_FACTORY_ABI,
  [ContractName.OrderFactory]: ORDER_FACTORY_ABI,
  // plugins
  // plugin resolvers
  [ContractName.PreventDoublePayingPluginFactory]:
    PREVENT_DOUBLE_PAYING_PLUGIN_FACTORY_ABI,
  [ContractName.DecreaseInventoryPluginFactory]:
    DECREASE_INVENTORY_PLUGIN_FACTORY_ABI,
  [ContractName.UpdatePricePluginsAfterOrderPluginFactory]:
    UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_FACTORY_ABI,
  [ContractName.UpdatePricePluginsAfterRefundPluginFactory]:
    UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_FACTORY_ABI,
  // before order plugins
  [ContractName.OperatorAllowlistBeforeOrderPluginFactory]:
    OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_FACTORY_ABI,
  [ContractName.PauseProductBeforeOrderPluginFactory]:
    PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_FACTORY_ABI,
  ////////// LOSA Contracts //////////
  // schemas and schema plugin resolvers
  [ContractName.PluginResolver]: PLUGIN_RESOLVER_ABI,
  [ContractName.MarkOrderPaidSchemaResolver]: PLUGIN_RESOLVER_ABI,
  // core
  [ContractName.Price]: PRICE_WITH_PLUGINS_ABI,
  [ContractName.Inventory]: INVENTORY_ABI,
  [ContractName.Order]: ORDER_ABI,
  // plugins
  // plugin resolvers
  [ContractName.PreventDoublePayingPlugin]: PREVENT_DOUBLE_PAYING_PLUGIN_ABI,
  [ContractName.DecreaseInventoryPlugin]: DECREASE_INVENTORY_PLUGIN_ABI,
  [ContractName.UpdatePricePluginsAfterOrderPlugin]: UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_ABI,
  [ContractName.UpdatePricePluginsAfterRefundPlugin]: UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_ABI,
  // before order plugins
  [ContractName.OperatorAllowlistBeforeOrderPlugin]: OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_ABI,
  [ContractName.PauseProductBeforeOrderPlugin]: PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_ABI,
} as const

// Deployable contract bytecodes
export const CONTRACT_BYTECODE_MAPPING = {
  // core
  [ContractName.PluginResolver]: PLUGIN_RESOLVER_BYTECODE,
  [ContractName.Price]: PRICE_WITH_PLUGINS_BYTECODE,
  [ContractName.Inventory]: INVENTORY_BYTECODE,
  [ContractName.Order]: ORDER_BYTECODE,
  // plugins
  // plugin resolvers
  [ContractName.PreventDoublePayingPlugin]: PREVENT_DOUBLE_PAYING_PLUGIN_BYTECODE,
  [ContractName.DecreaseInventoryPlugin]: DECREASE_INVENTORY_PLUGIN_BYTECODE,
  [ContractName.UpdatePricePluginsAfterOrderPlugin]: UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_BYTECODE,
  [ContractName.UpdatePricePluginsAfterRefundPlugin]: UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_BYTECODE,
  // before order plugins
  [ContractName.OperatorAllowlistBeforeOrderPlugin]: OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_BYTECODE,
  [ContractName.PauseProductBeforeOrderPlugin]: PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_BYTECODE,
} as const

// Environment variable mappings for contracts
// todo: we don't need this to be an array
export const CONTRACT_ENV_MAPPING = {
  // general contracts
  [ContractName.EAS]: ["NEXT_PUBLIC_EAS_ADDRESS"],
  [ContractName.SchemaRegistry]: ["NEXT_PUBLIC_EAS_SCHEMA_REGISTRY_ADDRESS"],
  ////////// LOSA Factories //////////
  // schemas and schema plugin resolver
  [ContractName.PluginResolverFactory]: [
    "NEXT_PUBLIC_PLUGIN_RESOLVER_FACTORY_ADDRESS",
  ],
  [ContractName.OrderPaidSchemaFactory]: [
    "NEXT_PUBLIC_ORDER_PAID_SCHEMA_FACTORY_ADDRESS",
  ],
  [ContractName.OrderRefundedSchemaFactory]: [
    "NEXT_PUBLIC_ORDER_REFUNDED_SCHEMA_FACTORY_ADDRESS",
  ],
  // core
  [ContractName.PriceFactory]: ["NEXT_PUBLIC_PRICE_FACTORY_ADDRESS"],
  [ContractName.InventoryFactory]: ["NEXT_PUBLIC_INVENTORY_FACTORY_ADDRESS"],
  [ContractName.OrderFactory]: ["NEXT_PUBLIC_ORDER_FACTORY_ADDRESS"],
  // plugins
  // plugin resolvers
  [ContractName.PreventDoublePayingPluginFactory]: [
    "NEXT_PUBLIC_PREVENT_DOUBLE_PAYING_PLUGIN_FACTORY_ADDRESS",
  ],
  [ContractName.DecreaseInventoryPluginFactory]: [
    "NEXT_PUBLIC_DECREASE_INVENTORY_PLUGIN_FACTORY_ADDRESS",
  ],
  [ContractName.UpdatePricePluginsAfterOrderPluginFactory]: [
    "NEXT_PUBLIC_UPDATE_PRICE_PLUGINS_AFTER_ORDER_PLUGIN_FACTORY_ADDRESS",
  ],
  [ContractName.UpdatePricePluginsAfterRefundPluginFactory]: [
    "NEXT_PUBLIC_UPDATE_PRICE_PLUGINS_AFTER_REFUND_PLUGIN_FACTORY_ADDRESS",
  ],
  // before order plugins
  [ContractName.OperatorAllowlistBeforeOrderPluginFactory]: [
    "NEXT_PUBLIC_OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_FACTORY_ADDRESS",
  ],
  [ContractName.PauseProductBeforeOrderPluginFactory]: [
    "NEXT_PUBLIC_PAUSE_PRODUCT_BEFORE_ORDER_PLUGIN_FACTORY_ADDRESS",
  ],
  ////////// LOSA Contracts //////////
  // schemas and schema plugin resolvers
  [ContractName.MarkOrderPaidSchemaResolver]: [
    "NEXT_PUBLIC_SELLER_MARK_ORDER_PAID_PLUGIN_RESOLVER_ADDRESS",
  ],
  [ContractName.Inventory]: ["NEXT_PUBLIC_SELLER_INVENTORY_CONTRACT_ADDRESS"],
  [ContractName.Price]: ["NEXT_PUBLIC_SELLER_PRICE_CONTRACT_ADDRESS"],
  [ContractName.Order]: ["NEXT_PUBLIC_SELLER_ORDER_CONTRACT_ADDRESS"],
} as const

// ============================================================================
// SCHEMA CONFIGURATION
// ============================================================================

// Schema names and their environment variable mappings
export enum SchemaName {
  // product info
  PRODUCT = "Product",
  VARIATION = "Variation",
  RETURN_WINDOW = "ReturnWindow",
  RETURN_POLICY = "ReturnPolicy",
  SHIPPING_COST_TYPE = "ShippingCostType",
  MEDIA_MANIFEST = "MediaManifest",
  SKU = "SKU",
  UPC = "UPC",
  STORE_ID = "StoreId",
  // store info
  STORE = "Store",
  ORDER_CONTRACT = "OrderContract",
  LOGO = "Logo",
  WEBSITE = "Website",
  EMAIL = "Email",
  // common
  NAME = "Name",
  DESCRIPTION = "Description",
  // orders
  ORDER = "Order",
  MARK_ORDER_AS_PAID = "MarkOrderAsPaid",
  ORDER_REFUNDED = "OrderRefunded",
  REVIEW = "Review",
}

export const SCHEMA_ENV_MAPPING = {
  // product info
  [SchemaName.PRODUCT]: "NEXT_PUBLIC_PRODUCT_SCHEMA_UID",
  [SchemaName.VARIATION]: "NEXT_PUBLIC_VARIATION_SCHEMA_UID",
  [SchemaName.RETURN_WINDOW]: "NEXT_PUBLIC_RETURN_WINDOW_SCHEMA_UID",
  [SchemaName.RETURN_POLICY]: "NEXT_PUBLIC_RETURN_POLICY_SCHEMA_UID",
  [SchemaName.SHIPPING_COST_TYPE]: "NEXT_PUBLIC_SHIPPING_COST_TYPE_SCHEMA_UID",
  [SchemaName.MEDIA_MANIFEST]: "NEXT_PUBLIC_MEDIA_MANIFEST_SCHEMA_UID",
  [SchemaName.SKU]: "NEXT_PUBLIC_SKU_SCHEMA_UID",
  [SchemaName.UPC]: "NEXT_PUBLIC_UPC_SCHEMA_UID",
  [SchemaName.STORE_ID]: "NEXT_PUBLIC_STORE_ID_SCHEMA_UID",
  // store info
  [SchemaName.STORE]: "NEXT_PUBLIC_STORE_SCHEMA_UID",
  [SchemaName.ORDER_CONTRACT]: "NEXT_PUBLIC_ORDER_CONTRACT_SCHEMA_UID",
  [SchemaName.LOGO]: "NEXT_PUBLIC_LOGO_SCHEMA_UID",
  [SchemaName.WEBSITE]: "NEXT_PUBLIC_WEBSITE_SCHEMA_UID",
  [SchemaName.EMAIL]: "NEXT_PUBLIC_EMAIL_SCHEMA_UID",
  // common
  [SchemaName.NAME]: "NEXT_PUBLIC_NAME_SCHEMA_UID",
  [SchemaName.DESCRIPTION]: "NEXT_PUBLIC_DESCRIPTION_SCHEMA_UID",
  // orders
  [SchemaName.ORDER]: "NEXT_PUBLIC_ORDER_SCHEMA_UID",
  [SchemaName.MARK_ORDER_AS_PAID]: "NEXT_PUBLIC_MARK_ORDER_PAID_SCHEMA_UID",
  [SchemaName.ORDER_REFUNDED]: "NEXT_PUBLIC_ORDER_REFUNDED_SCHEMA_UID",
  [SchemaName.REVIEW]: "NEXT_PUBLIC_REVIEW_SCHEMA_UID",
} as const

// ============================================================================
// FACTORY CONTRACT CONFIGURATION
// ============================================================================

// Factory to deployable mapping
export const FACTORY_DEPLOYABLE_MAPPING = {
  // schemas and schema plugin resolvers
  [ContractName.PluginResolverFactory]: [ContractName.PluginResolver],
  // core
  [ContractName.PriceFactory]: [ContractName.Price],
  [ContractName.InventoryFactory]: [ContractName.Inventory],
  [ContractName.OrderFactory]: [ContractName.Order],
  // plugins
  // plugin resolvers
  [ContractName.PreventDoublePayingPluginFactory]: [ContractName.PreventDoublePayingPlugin],
  [ContractName.DecreaseInventoryPluginFactory]: [ContractName.DecreaseInventoryPlugin],
  [ContractName.UpdatePricePluginsAfterOrderPluginFactory]: [ContractName.UpdatePricePluginsAfterOrderPlugin],
  [ContractName.UpdatePricePluginsAfterRefundPluginFactory]: [ContractName.UpdatePricePluginsAfterRefundPlugin],
  // before order plugins
  [ContractName.OperatorAllowlistBeforeOrderPluginFactory]: [ContractName.OperatorAllowlistBeforeOrderPlugin],
  [ContractName.PauseProductBeforeOrderPluginFactory]: [ContractName.PauseProductBeforeOrderPlugin],
} as const

// ============================================================================
// CONTRACT SYSTEM TYPES
// ============================================================================

// Represents a contract deployment on a specific chain
export type ContractChainConfig = {
  chain: (typeof ACTIVE_CHAIN_OBJECTS)[number]
  address: Address
}

// Configuration for a single contract across multiple chains
export type ContractConfig<TAbi extends Abi> = {
  abi: TAbi
  [chainId: number]: ContractChainConfig
}

// Configuration for all contracts
export type ContractsConfig = {
  [key in ContractName]: ContractConfig<Abi>
}