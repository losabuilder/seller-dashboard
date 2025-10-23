export const DECREASE_INVENTORY_PLUGIN_FACTORY_ABI = [
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
        "internalType": "contract DecreaseInventoryPlugin"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deploy",
    "inputs": [
      {
        "name": "inventoryContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "address"
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
        "internalType": "contract DecreaseInventoryPlugin"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBytecode",
    "inputs": [
      {
        "name": "inventoryContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "eas",
        "type": "address",
        "internalType": "address"
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
    "name": "DecreaseInventoryPluginDeployed",
    "inputs": [
      {
        "name": "deployer",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "deployedContract",
        "type": "address",
        "indexed": true,
        "internalType": "contract DecreaseInventoryPlugin"
      }
    ],
    "anonymous": false
  }
] as const;
