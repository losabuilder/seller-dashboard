import { keccak256, encodePacked } from 'viem';

// Function to generate a unique salt
export function generateSalt(userAddress: `0x${string}`) {
  const timestamp = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const salt = keccak256(encodePacked(['address', 'uint256'], [userAddress, BigInt(timestamp)]));
  return salt;
}

// Function to generate a unique salt from key for additional entropy
export function generateSaltFromKey(userAddress: `0x${string}`, key: string) {
  const timestamp = Math.floor(Date.now() / 1000); // current timestamp in seconds
  const salt = keccak256(encodePacked(['address', 'string', 'uint256'], [userAddress, key, BigInt(timestamp)]));
  return salt;
}

export function getCreate2Address(
  creatorAddress: `0x${string}`,
  salt: `0x${string}`,
  bytecode: `0x${string}`,
) {
  return `0x${keccak256(
    `0x${['ff', creatorAddress, keccak256(salt), keccak256(bytecode)]
      .map((x) => x.replace(/0x/, ''))
      .join('')}`, // Fix: join the array elements first
  ).slice(-40)}`;
}
