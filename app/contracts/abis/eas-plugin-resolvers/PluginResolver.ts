export const PLUGIN_RESOLVER_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_owner", type: "address", internalType: "address" },
      { name: "_eas", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addExecutingResolver",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IExecutingResolver",
      },
      { name: "catchErrors", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addValidatingResolver",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IValidatingResolver",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "attest",
    inputs: [
      {
        name: "attestation",
        type: "tuple",
        internalType: "struct Attestation",
        components: [
          { name: "uid", type: "bytes32", internalType: "bytes32" },
          { name: "schema", type: "bytes32", internalType: "bytes32" },
          { name: "time", type: "uint64", internalType: "uint64" },
          { name: "expirationTime", type: "uint64", internalType: "uint64" },
          { name: "revocationTime", type: "uint64", internalType: "uint64" },
          { name: "refUID", type: "bytes32", internalType: "bytes32" },
          { name: "recipient", type: "address", internalType: "address" },
          { name: "attester", type: "address", internalType: "address" },
          { name: "revocable", type: "bool", internalType: "bool" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getExecutingResolverAt",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IExecutingResolver",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getExecutingResolverErrorCatching",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IExecutingResolver",
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getExecutingResolvers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "contract IExecutingResolver[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getExecutingResolversLength",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidatingResolverAt",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IValidatingResolver",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidatingResolvers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "contract IValidatingResolver[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getValidatingResolversLength",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVersion",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isPayable",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "multiAttest",
    inputs: [
      {
        name: "attestations",
        type: "tuple[]",
        internalType: "struct Attestation[]",
        components: [
          { name: "uid", type: "bytes32", internalType: "bytes32" },
          { name: "schema", type: "bytes32", internalType: "bytes32" },
          { name: "time", type: "uint64", internalType: "uint64" },
          { name: "expirationTime", type: "uint64", internalType: "uint64" },
          { name: "revocationTime", type: "uint64", internalType: "uint64" },
          { name: "refUID", type: "bytes32", internalType: "bytes32" },
          { name: "recipient", type: "address", internalType: "address" },
          { name: "attester", type: "address", internalType: "address" },
          { name: "revocable", type: "bool", internalType: "bool" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
      { name: "values", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "multiRevoke",
    inputs: [
      {
        name: "attestations",
        type: "tuple[]",
        internalType: "struct Attestation[]",
        components: [
          { name: "uid", type: "bytes32", internalType: "bytes32" },
          { name: "schema", type: "bytes32", internalType: "bytes32" },
          { name: "time", type: "uint64", internalType: "uint64" },
          { name: "expirationTime", type: "uint64", internalType: "uint64" },
          { name: "revocationTime", type: "uint64", internalType: "uint64" },
          { name: "refUID", type: "bytes32", internalType: "bytes32" },
          { name: "recipient", type: "address", internalType: "address" },
          { name: "attester", type: "address", internalType: "address" },
          { name: "revocable", type: "bool", internalType: "bool" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
      { name: "values", type: "uint256[]", internalType: "uint256[]" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pendingOwner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeExecutingResolver",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IExecutingResolver",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeValidatingResolver",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IValidatingResolver",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revoke",
    inputs: [
      {
        name: "attestation",
        type: "tuple",
        internalType: "struct Attestation",
        components: [
          { name: "uid", type: "bytes32", internalType: "bytes32" },
          { name: "schema", type: "bytes32", internalType: "bytes32" },
          { name: "time", type: "uint64", internalType: "uint64" },
          { name: "expirationTime", type: "uint64", internalType: "uint64" },
          { name: "revocationTime", type: "uint64", internalType: "uint64" },
          { name: "refUID", type: "bytes32", internalType: "bytes32" },
          { name: "recipient", type: "address", internalType: "address" },
          { name: "attester", type: "address", internalType: "address" },
          { name: "revocable", type: "bool", internalType: "bool" },
          { name: "data", type: "bytes", internalType: "bytes" },
        ],
      },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "setExecutingResolverErrorCatching",
    inputs: [
      {
        name: "resolver",
        type: "address",
        internalType: "contract IExecutingResolver",
      },
      { name: "catchErrors", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ExecutingResolverAdded",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IExecutingResolver",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExecutingResolverErrorCatchingSet",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IExecutingResolver",
      },
      {
        name: "catchErrors",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExecutingResolverFailed",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IExecutingResolver",
      },
      {
        name: "isAttestation",
        type: "bool",
        indexed: true,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ExecutingResolverRemoved",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IExecutingResolver",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferStarted",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ValidatingResolverAdded",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IValidatingResolver",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ValidatingResolverRemoved",
    inputs: [
      {
        name: "resolver",
        type: "address",
        indexed: true,
        internalType: "contract IValidatingResolver",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "AccessDenied", inputs: [] },
  { type: "error", name: "InsufficientValue", inputs: [] },
  { type: "error", name: "InvalidEAS", inputs: [] },
  { type: "error", name: "InvalidLength", inputs: [] },
  { type: "error", name: "NotPayable", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "PluginResolver__DuplicateResolver",
    inputs: [{ name: "resolver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "PluginResolver__IndexOutOfBounds",
    inputs: [
      { name: "index", type: "uint256", internalType: "uint256" },
      { name: "length", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "PluginResolver__InvalidResolver",
    inputs: [{ name: "resolver", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "PluginResolver__ResolverNotFound",
    inputs: [{ name: "resolver", type: "address", internalType: "address" }],
  },
] as const

export type PluginResolverABI = typeof PLUGIN_RESOLVER_ABI
