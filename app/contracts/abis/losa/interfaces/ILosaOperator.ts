export const I_LOSA_OPERATOR_ABI = [
  {
    "type": "function",
    "name": "authorizeOrder",
    "inputs": [
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
        "name": "orderPaidAttestationUid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getEscrow",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract AuthCaptureEscrow"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getIsAuthorizer",
    "inputs": [
      {
        "name": "authorizer",
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
    "name": "getOrderDataTypeHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPaymentAuthTypeHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPaymentInfoHashToOrderPaidAttestationUid",
    "inputs": [
      {
        "name": "paymentInfoHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "owner_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "executors",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "authorizers",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateAuthorizer",
    "inputs": [
      {
        "name": "authorizer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowed",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AuthorizerUpdated",
    "inputs": [
      {
        "name": "authorizer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "allowed",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrderAuthorized",
    "inputs": [
      {
        "name": "orderPaidAttestationUid",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "paymentInfoHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "orderContract",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidAuthorizer",
    "inputs": [
      {
        "name": "authorizer",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
