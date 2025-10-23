export const OPERATOR_ALLOWLIST_BEFORE_ORDER_PLUGIN_FACTORY_ABI = [
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
        "internalType": "contract OperatorAllowlistBeforeOrderPlugin"
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
        "internalType": "contract OperatorAllowlistBeforeOrderPlugin"
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
    "name": "OperatorAllowlistBeforeOrderPluginDeployed",
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
        "internalType": "contract OperatorAllowlistBeforeOrderPlugin"
      }
    ],
    "anonymous": false
  }
] as const;
