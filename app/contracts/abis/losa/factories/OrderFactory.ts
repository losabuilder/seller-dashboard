export const ORDER_FACTORY_ABI = [
  {
    "type": "function",
    "name": "computeAddress",
    "inputs": [
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "bytecode",
        "type": "bytes",
        "internalType": "bytes"
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
    "name": "contracts",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract Order"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "contract IEAS"
      },
      {
        "name": "priceContract",
        "type": "address",
        "internalType": "contract IPriceWithPlugins"
      },
      {
        "name": "inventoryContract",
        "type": "address",
        "internalType": "contract IInventory"
      },
      {
        "name": "orderSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderPaidSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderRefundedSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "validPaymentReceivers",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract Order"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBytecode",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "contract IEAS"
      },
      {
        "name": "priceContract",
        "type": "address",
        "internalType": "contract IPriceWithPlugins"
      },
      {
        "name": "inventoryContract",
        "type": "address",
        "internalType": "contract IInventory"
      },
      {
        "name": "orderSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderPaidSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "orderRefundedSchema",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "validPaymentReceivers",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "event",
    "name": "OrderDeployed",
    "inputs": [
      {
        "name": "deployer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "initOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "deployedContract",
        "type": "address",
        "indexed": true,
        "internalType": "contract Order"
      }
    ],
    "anonymous": false
  }
] as const;
