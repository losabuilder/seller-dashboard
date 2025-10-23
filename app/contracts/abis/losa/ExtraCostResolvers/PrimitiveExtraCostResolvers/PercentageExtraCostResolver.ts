export const PERCENTAGE_EXTRA_COST_RESOLVER_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "percentage",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "contract IEAS"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "I_EAS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IEAS"
      }
    ],
    "stateMutability": "view"
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
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveOrderItemExtraCost",
    "inputs": [
      {
        "name": "orderItemWithPrice",
        "type": "tuple",
        "internalType": "struct OrderItemWithPrice",
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
            "name": "price",
            "type": "tuple",
            "internalType": "struct Price",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymentToken",
                "type": "address",
                "internalType": "address"
              }
            ]
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      },
      {
        "name": "orderExtraCostToResolve",
        "type": "tuple",
        "internalType": "struct OrderExtraCost",
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
        "type": "tuple[]",
        "internalType": "struct OrderItemWithPriceAndExtraCosts[]",
        "components": [
          {
            "name": "itemWithPrice",
            "type": "tuple",
            "internalType": "struct OrderItemWithPrice",
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
                "name": "price",
                "type": "tuple",
                "internalType": "struct Price",
                "components": [
                  {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "paymentToken",
                    "type": "address",
                    "internalType": "address"
                  }
                ]
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
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
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ResolvedExtraCost",
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
            "name": "requiresOffChainCalculation",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "resolveOrderWideExtraCost",
    "inputs": [
      {
        "name": "orderExtraCostToResolve",
        "type": "tuple",
        "internalType": "struct OrderExtraCost",
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
        "name": "allOrderItemsWithPriceAndExtraCostsInOrder",
        "type": "tuple[]",
        "internalType": "struct OrderItemWithPriceAndExtraCosts[]",
        "components": [
          {
            "name": "itemWithPrice",
            "type": "tuple",
            "internalType": "struct OrderItemWithPrice",
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
                "name": "price",
                "type": "tuple",
                "internalType": "struct Price",
                "components": [
                  {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                  },
                  {
                    "name": "paymentToken",
                    "type": "address",
                    "internalType": "address"
                  }
                ]
              },
              {
                "name": "data",
                "type": "bytes",
                "internalType": "bytes"
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
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ResolvedExtraCost",
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
            "name": "requiresOffChainCalculation",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "resolveRefundOrderItemExtraCost",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderItemExtraCostPaid",
        "type": "tuple",
        "internalType": "struct OrderExtraCost",
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
        "name": "orderItemAmountPiad",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "refundItem",
        "type": "tuple",
        "internalType": "struct RefundItemWithAmount",
        "components": [
          {
            "name": "item",
            "type": "tuple",
            "internalType": "struct RefundItem",
            "components": [
              {
                "name": "orderAttestationUid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "quantity",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "extraCostsData",
                "type": "tuple[]",
                "internalType": "struct ExtraCostExtraData[]",
                "components": [
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
            "name": "amount",
            "type": "tuple",
            "internalType": "struct Price",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymentToken",
                "type": "address",
                "internalType": "address"
              }
            ]
          }
        ]
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct RefundItemWithAmount[]",
        "components": [
          {
            "name": "item",
            "type": "tuple",
            "internalType": "struct RefundItem",
            "components": [
              {
                "name": "orderAttestationUid",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "quantity",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "extraCostsData",
                "type": "tuple[]",
                "internalType": "struct ExtraCostExtraData[]",
                "components": [
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
            "name": "amount",
            "type": "tuple",
            "internalType": "struct Price",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymentToken",
                "type": "address",
                "internalType": "address"
              }
            ]
          }
        ]
      },
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [
      {
        "name": "resolvedRefundExtraCost",
        "type": "tuple",
        "internalType": "struct ResolvedRefundExtraCost",
        "components": [
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isAdditive",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "requiresOffChainCalculation",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "resolveRefundOrderWideExtraCost",
    "inputs": [
      {
        "name": "orderPaidUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderWideExtraCost",
        "type": "tuple",
        "internalType": "struct OrderExtraCost",
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
        "name": "allOrderItemsToBeRefundedResolved",
        "type": "tuple[]",
        "internalType": "struct RefundOrderItemPricedAndResolved[]",
        "components": [
          {
            "name": "orderAttestationUid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "quantity",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "amount",
            "type": "tuple",
            "internalType": "struct Price",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "paymentToken",
                "type": "address",
                "internalType": "address"
              }
            ]
          },
          {
            "name": "resolvedRefundExtraCosts",
            "type": "tuple[]",
            "internalType": "struct ResolvedRefundExtraCost[]",
            "components": [
              {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "isAdditive",
                "type": "bool",
                "internalType": "bool"
              },
              {
                "name": "reasonHash",
                "type": "bytes32",
                "internalType": "bytes32"
              },
              {
                "name": "requiresOffChainCalculation",
                "type": "bool",
                "internalType": "bool"
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
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "resolvedRefundExtraCost",
        "type": "tuple",
        "internalType": "struct ResolvedRefundExtraCost",
        "components": [
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "isAdditive",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "requiresOffChainCalculation",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "s_percentage",
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
    "name": "setPercentage",
    "inputs": [
      {
        "name": "percentage",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
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
    "type": "event",
    "name": "PercentageUpdated",
    "inputs": [
      {
        "name": "percentage",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
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
