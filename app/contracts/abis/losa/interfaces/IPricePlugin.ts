export const I_PRICE_PLUGIN_ABI = [
  {
    "type": "function",
    "name": "afterOrder",
    "inputs": [
      {
        "name": "orderPaidAttestation",
        "type": "tuple",
        "internalType": "struct Attestation",
        "components": [
          {
            "name": "uid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "time",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "expirationTime",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "revocationTime",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "refUID",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "recipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "revocable",
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
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "afterRefund",
    "inputs": [
      {
        "name": "orderRefundedAttestation",
        "type": "tuple",
        "internalType": "struct Attestation",
        "components": [
          {
            "name": "uid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "schema",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "time",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "expirationTime",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "revocationTime",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "refUID",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "recipient",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "attester",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "revocable",
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
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "calculateRefund",
    "inputs": [
      {
        "name": "orderPaidAttestationUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "refundItems",
        "type": "tuple[]",
        "internalType": "struct RefundItem[]",
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
        "name": "refundOrderWideExtraCostsData",
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
      },
      {
        "name": "existingRefundsInOrder",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      },
      {
        "name": "additionalData",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "refundOrderItemsPricedAndResolved",
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
        "name": "resolvedRefundOrderWideExtraCosts",
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
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderPrice",
    "inputs": [
      {
        "name": "orderItems",
        "type": "tuple[]",
        "internalType": "struct OrderItem[]",
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
        "name": "buyer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct OrderItemWithPrice[]",
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
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrderPriceWithResolvedExtraCosts",
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
        "name": "buyer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct OrderItemPricedAndResolved[]",
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
            "name": "resolvedExtraCosts",
            "type": "tuple[]",
            "internalType": "struct ResolvedExtraCost[]",
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
        "internalType": "struct ResolvedExtraCost[]",
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
  }
] as const;
