export const OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowedOperators",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "defaultMaxFeeBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "defaultMinRefundExpiry",
        "type": "uint32",
        "internalType": "uint32"
      },
      {
        "name": "defaultMaxRefundExpiry",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "acceptOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "beforeOrder",
    "inputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct OrderItemWithExtraCosts[]",
        "components": [
          {
            "name": "item",
            "type": "tuple",
            "internalType": "struct OrderItem",
            "components": [
              {
                "name": "skuUid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "quantity",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "orderAttestationUid",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "extraCosts",
            "type": "tuple[]",
            "internalType": "struct OrderExtraCost[]",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "reasonHash",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          }
        ]
      },
      {
        "name": "paymentAuthorization",
        "type": "tuple",
        "internalType": "struct PaymentAuthorization",
        "components": [
          {
            "name": "paymentInfo",
            "type": "tuple",
            "internalType": "struct AuthCaptureEscrow.PaymentInfo",
            "components": [
              {
                "name": "operator",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "payer",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "receiver",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "token",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "maxAmount",
                "type": "uint120",
                "internalType": "uint120"
              },
              {
                "name": "preApprovalExpiry",
                "type": "uint48",
                "internalType": "uint48"
              },
              {
                "name": "authorizationExpiry",
                "type": "uint48",
                "internalType": "uint48"
              },
              {
                "name": "refundExpiry",
                "type": "uint48",
                "internalType": "uint48"
              },
              {
                "name": "minFeeBps",
                "type": "uint16",
                "internalType": "uint16"
              },
              {
                "name": "maxFeeBps",
                "type": "uint16",
                "internalType": "uint16"
              },
              {
                "name": "feeReceiver",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "salt",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tokenCollector",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "collectorData",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "authorizer",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "signature",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct OrderExtraCost[]",
        "components": [
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct PricePlugin",
        "components": [
          {
            "name": "plugin",
            "type": "address",
            "internalType": "contract IPricePlugin"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllowedOperators",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllowedOperatorsLength",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDefaultMaxFeeBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDefaultMaxRefundExpiry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDefaultMinRefundExpiry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOperatorAt",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOperatorHasSettings",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOperatorSettings",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct OperatorSettings",
        "components": [
          {
            "name": "maxFeeBps",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "minRefundExpiry",
            "type": "uint48",
            "internalType": "uint48"
          },
          {
            "name": "maxRefundExpiry",
            "type": "uint48",
            "internalType": "uint48"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isOperatorAllowed",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pendingOwner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removeOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeOperatorSettings",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateDefaultMaxFeeBps",
    "inputs": [
      {
        "name": "defaultMaxFeeBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateDefaultMaxRefundExpiry",
    "inputs": [
      {
        "name": "defaultMaxRefundExpiry",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateDefaultMinRefundExpiry",
    "inputs": [
      {
        "name": "defaultMinRefundExpiry",
        "type": "uint32",
        "internalType": "uint32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateOperatorSettings",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "maxFeeBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "minRefundExpiry",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "maxRefundExpiry",
        "type": "uint48",
        "internalType": "uint48"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "DefaultMaxFeeBpsUpdated",
    "inputs": [
      {
        "name": "maxFeeBps",
        "type": "uint16",
        "indexed": true,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DefaultMaxRefundExpiryUpdated",
    "inputs": [
      {
        "name": "maxRefundExpiry",
        "type": "uint32",
        "indexed": true,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DefaultMinRefundExpiryUpdated",
    "inputs": [
      {
        "name": "minRefundExpiry",
        "type": "uint32",
        "indexed": true,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorAdded",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorRemoved",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorSettingsRemoved",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OperatorSettingsUpdated",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "maxFeeBps",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "minRefundExpiry",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      },
      {
        "name": "maxRefundExpiry",
        "type": "uint48",
        "indexed": false,
        "internalType": "uint48"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferStarted",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__IndexOutOfBounds",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__InvalidDefaultMaxFeeBps",
    "inputs": [
      {
        "name": "maxFeeBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__InvalidDefaultRefundExpiry",
    "inputs": [
      {
        "name": "minRefundExpiry",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "maxRefundExpiry",
        "type": "uint48",
        "internalType": "uint48"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__InvalidMaxFeeBps",
    "inputs": [
      {
        "name": "maxFeeBps",
        "type": "uint16",
        "internalType": "uint16"
      },
      {
        "name": "maxFeeBpsAllowed",
        "type": "uint16",
        "internalType": "uint16"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__InvalidOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__InvalidRefundExpiry",
    "inputs": [
      {
        "name": "refundExpiry",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "minRefundExpiryTimestamp",
        "type": "uint48",
        "internalType": "uint48"
      },
      {
        "name": "maxRefundExpiryTimestamp",
        "type": "uint48",
        "internalType": "uint48"
      }
    ]
  },
  {
    "type": "error",
    "name": "OperatorAllowlistBeforeOrderPlugin__OperatorAlreadyAllowed",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
