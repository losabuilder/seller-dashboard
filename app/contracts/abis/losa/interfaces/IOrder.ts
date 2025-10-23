export const I_ORDER_ABI = [
  {
    "type": "function",
    "name": "addBeforeOrderPlugin",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IBeforeOrderPlugin"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createAndPayForOrder",
    "inputs": [
      {
        "name": "orderAttestationRequest",
        "type": "tuple",
        "internalType": "struct MultiDelegatedAttestationRequest",
        "components": [
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "data",
            "type": "tuple[]",
            "internalType": "struct AttestationRequestData[]",
            "components": [
              {
                "name": "recipient",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "expirationTime",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "revocable",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "refUID",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "value",
                "type": "uint256",
                "internalType": "uint256"
              }
            ]
          },
          {
            "name": "signatures",
            "type": "tuple[]",
            "internalType": "struct Signature[]",
            "components": [
              {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "deadline",
            "type": "uint64",
            "internalType": "uint64"
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
        "name": "extraCosts",
        "type": "tuple",
        "internalType": "struct OrderExtraCosts",
        "components": [
          {
            "name": "orderItemToExtraCosts",
            "type": "tuple[][]",
            "internalType": "struct OrderExtraCost[][]",
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
            "name": "orderWideExtraCosts",
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
        "name": "pricePlugin",
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
        "type": "tuple",
        "internalType": "struct OrderResult",
        "components": [
          {
            "name": "orderAttestationUids",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          {
            "name": "orderPaidAttestationUid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "receiptId",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAvailableQuantity",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "buyer",
        "type": "address",
        "internalType": "address"
      }
    ],
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
    "name": "getBeforeOrderPlugins",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "contract IBeforeOrderPlugin[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getBeforeOrderPluginsLength",
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
    "name": "payForOrder",
    "inputs": [
      {
        "name": "orderItemsWithExtraCosts",
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
        "name": "orderWideExtraCosts",
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
        "name": "pricePlugin",
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
        "type": "tuple",
        "internalType": "struct OrderResult",
        "components": [
          {
            "name": "orderAttestationUids",
            "type": "bytes32[]",
            "internalType": "bytes32[]"
          },
          {
            "name": "orderPaidAttestationUid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "receiptId",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeBeforeOrderPlugin",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IBeforeOrderPlugin"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setInventoryContract",
    "inputs": [
      {
        "name": "inventoryContract",
        "type": "address",
        "internalType": "contract IInventory"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOrderPaidSchema",
    "inputs": [
      {
        "name": "orderPaidSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPriceContract",
    "inputs": [
      {
        "name": "priceContract",
        "type": "address",
        "internalType": "contract IPriceWithPlugins"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ApprovedHash",
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeforeOrderPluginAdded",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IBeforeOrderPlugin"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BeforeOrderPluginRemoved",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IBeforeOrderPlugin"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "InventoryContractUpdated",
    "inputs": [
      {
        "name": "inventoryContract",
        "type": "address",
        "indexed": true,
        "internalType": "contract IInventory"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderCreatedAndPaid",
    "inputs": [
      {
        "name": "orderAttestationUids",
        "type": "bytes32[]",
        "indexed": true,
        "internalType": "bytes32[]"
      },
      {
        "name": "orderPaidAttestationUid",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "receiptId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "requiresOffChainCalculation",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderPaid",
    "inputs": [
      {
        "name": "orderAttestationUids",
        "type": "bytes32[]",
        "indexed": true,
        "internalType": "bytes32[]"
      },
      {
        "name": "orderPaidAttestationUids",
        "type": "bytes32[]",
        "indexed": true,
        "internalType": "bytes32[]"
      },
      {
        "name": "receiptId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderPaidSchemaUpdated",
    "inputs": [
      {
        "name": "orderPaidSchema",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderRefundedSchemaUpdated",
    "inputs": [
      {
        "name": "orderRefundedSchema",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderSchemaUpdated",
    "inputs": [
      {
        "name": "orderSchema",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PriceContractUpdated",
    "inputs": [
      {
        "name": "priceContract",
        "type": "address",
        "indexed": true,
        "internalType": "contract IPriceWithPlugins"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ValidPaymentReceiverAdded",
    "inputs": [
      {
        "name": "paymentReceiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ValidPaymentReceiverRemoved",
    "inputs": [
      {
        "name": "paymentReceiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "Order__BeforeOrderPluginFaild",
    "inputs": [
      {
        "name": "pluginAddress",
        "type": "address",
        "internalType": "contract IBeforeOrderPlugin"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__DuplicateBeforeOrderPlugin",
    "inputs": [
      {
        "name": "providedPlugin",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__ExtraCostAmountNotMet",
    "inputs": [
      {
        "name": "reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "providedAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "minimumExpectedAmount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__IndexOutOfBounds",
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
    "name": "Order__InsufficientPaymentAmount",
    "inputs": [
      {
        "name": "expectedTotalPriceAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expectedMinimumTotalResolvedExtraCosts",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "providedAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "requiresOffChainCalculation",
        "type": "bool",
        "internalType": "bool"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidBeforeOrderPlugin",
    "inputs": [
      {
        "name": "providedPlugin",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidCurrency",
    "inputs": [
      {
        "name": "expectedCurrency",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "providedCurrency",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidEAS",
    "inputs": [
      {
        "name": "providedEAS",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidInventoryContract",
    "inputs": [
      {
        "name": "providedInventoryContract",
        "type": "address",
        "internalType": "contract IInventory"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidOrderSchema",
    "inputs": [
      {
        "name": "providedSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "expectedSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidPaymentReceiver",
    "inputs": [
      {
        "name": "providedAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidPriceContract",
    "inputs": [
      {
        "name": "providedPriceContract",
        "type": "address",
        "internalType": "contract IPriceWithPlugins"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__InvalidSchema",
    "inputs": [
      {
        "name": "providedSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__MissingExtraCost",
    "inputs": [
      {
        "name": "reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "Order__MultipleDifferentAttesters",
    "inputs": []
  }
] as const;
