export const I_PRICE_WITH_PLUGINS_ABI = [
  {
    "type": "function",
    "name": "addAllowedUpdater",
    "inputs": [
      {
        "name": "updater",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addPricePlugin",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
      },
      {
        "name": "notifyOnOrderPaid",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "notifyOnOrderRefunded",
        "type": "bool",
        "internalType": "bool"
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
    "name": "getAllOrderItemExpectedExtraCostsReasonHashesForSku",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllowedUpdaterAt",
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
    "name": "getAllowedUpdaters",
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
    "name": "getAllowedUpdatersLength",
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
    "name": "getOrderItemExpectedExtraCostByReasonHashForSku",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ExpectedExtraCost",
        "components": [
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
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
        "name": "orderItemsWithPrice",
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
      }
    ],
    "outputs": [
      {
        "name": "orderItemsWithPrice",
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
      }
    ],
    "outputs": [
      {
        "name": "orderItemsPricedAndResolved",
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
        "name": "resolvedOrderWideExtraCosts",
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
        "name": "orderItemsPricedAndResolved",
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
        "name": "resolvedOrderWideExtraCosts",
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
  },
  {
    "type": "function",
    "name": "getPricePluginAt",
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
        "internalType": "contract IPricePlugin"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPricePlugins",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "contract IPricePlugin[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPricePluginsLength",
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
    "name": "getPricePluginsThatNotifyOnOrderPaid",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "contract IPricePlugin[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPricePluginsThatNotifyOnOrderRefunded",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "contract IPricePlugin[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSkuPrice",
    "inputs": [
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
        "name": "buyer",
        "type": "address",
        "internalType": "address"
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
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSkuPrice",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
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
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSkuPriceWithQuantity",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "quantity",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
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
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isAllowedUpdater",
    "inputs": [
      {
        "name": "updater",
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
    "name": "isNotifyOnOrderPaid",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
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
    "name": "isNotifyOnOrderRefunded",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
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
    "name": "isPricePluginActive",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
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
    "name": "removeAllowedUpdater",
    "inputs": [
      {
        "name": "updater",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeOrderItemExpectedExtraCost",
    "inputs": [
      {
        "name": "_skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeOrderWideExpectedExtraCost",
    "inputs": [
      {
        "name": "_reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removePricePlugin",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolveOrderItemExpectedExtraCosts",
    "inputs": [
      {
        "name": "orderItemWithPriceAndExtraCosts",
        "type": "tuple",
        "internalType": "struct OrderItemWithPriceAndExtraCosts",
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
      }
    ],
    "outputs": [
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
  },
  {
    "type": "function",
    "name": "resolveOrderWideExpectedExtraCosts",
    "inputs": [
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
      }
    ],
    "outputs": [
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
  },
  {
    "type": "function",
    "name": "setNotifyOnOrderPaid",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
      },
      {
        "name": "notify",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setNotifyOnOrderRefunded",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "internalType": "contract IPricePlugin"
      },
      {
        "name": "notify",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOrderItemExpectedExtraCost",
    "inputs": [
      {
        "name": "_skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_expectedExtraCost",
        "type": "tuple",
        "internalType": "struct ExpectedExtraCost",
        "components": [
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOrderItemExpectedExtraCosts",
    "inputs": [
      {
        "name": "_skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "_expectedExtraCosts",
        "type": "tuple[]",
        "internalType": "struct ExpectedExtraCost[]",
        "components": [
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setOrderWideExpectedExtraCost",
    "inputs": [
      {
        "name": "_expectedExtraCost",
        "type": "tuple",
        "internalType": "struct ExpectedExtraCost",
        "components": [
          {
            "name": "reasonHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "resolver",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPrice",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
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
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "NotifyOnOrderPaidSet",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IPricePlugin"
      },
      {
        "name": "notify",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "NotifyOnOrderRefundedSet",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IPricePlugin"
      },
      {
        "name": "notify",
        "type": "bool",
        "indexed": true,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderItemExpectedExtraCostRemoved",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "reasonHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderItemExpectedExtraCostSet",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "reasonHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "resolver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderWideExpectedExtraCostRemoved",
    "inputs": [
      {
        "name": "reasonHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderWideExpectedExtraCostSet",
    "inputs": [
      {
        "name": "reasonHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "resolver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PricePluginAdded",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IPricePlugin"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PricePluginRemoved",
    "inputs": [
      {
        "name": "plugin",
        "type": "address",
        "indexed": true,
        "internalType": "contract IPricePlugin"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PriceUpdated",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "price",
        "type": "tuple",
        "indexed": true,
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
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "PriceSimple__AlreadyAllowedUpdater",
    "inputs": [
      {
        "name": "updater",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "PriceSimple__FailedToRemoveAllowedUpdater",
    "inputs": [
      {
        "name": "updater",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "PriceSimple__FailedToRemoveOrderItemExpectedExtraCost",
    "inputs": [
      {
        "name": "skuUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "reasonHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "PriceSimple__FailedToRemoveOrderWideExpectedExtraCost",
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
    "name": "PriceSimple__NotAuthorizedToUpdatePrice",
    "inputs": [
      {
        "name": "updater",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "PriceWithPlugins__IndexOutOfBounds",
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
    "name": "PriceWithPlugins__InvalidPricePlugin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PriceWithPlugins__NotApproved",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
