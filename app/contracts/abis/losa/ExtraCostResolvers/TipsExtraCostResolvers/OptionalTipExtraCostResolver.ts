export const OPTIONAL_TIP_EXTRA_COST_RESOLVER_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveOrderItemExtraCost",
    "inputs": [
      {
        "name": "",
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
    "stateMutability": "pure"
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
    "stateMutability": "pure"
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
        "name": "",
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
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderWideExtraCostPaid",
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
    "stateMutability": "pure"
  }
] as const;
