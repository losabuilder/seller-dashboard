export const PLUGIN_RESOLVER_FACTORY_ABI = [
  {
    type: "function",
    name: "computeAddress",
    inputs: [
      { name: "_salt", type: "bytes32", internalType: "bytes32" },
      { name: "_bytecode", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "contracts",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "", type: "address", internalType: "contract PluginResolver" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deploy",
    inputs: [
      { name: "_salt", type: "bytes32", internalType: "bytes32" },
      { name: "_owner", type: "address", internalType: "address" },
      { name: "_eas", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "", type: "address", internalType: "contract PluginResolver" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBytecode",
    inputs: [{ name: "_owner", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "ResolverDeployed",
    inputs: [
      {
        name: "deployer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "initOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "deployedContract",
        type: "address",
        indexed: true,
        internalType: "contract PluginResolver",
      },
    ],
    anonymous: false,
  },
] as const

export type PluginResolverFactoryABI = typeof PLUGIN_RESOLVER_FACTORY_ABI

