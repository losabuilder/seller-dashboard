export const SEMVER_ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "major",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "minor",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "patch",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  }
] as const;
