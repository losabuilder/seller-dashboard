# LOSA Seller Dashboard

This is a [Next.js](https://nextjs.org) project for managing contracts across multiple blockchain networks with automated configuration generation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contract Configuration System

This project uses a centralized configuration system for managing contracts, ABIs, schemas, and chains. All configuration is managed through a single source of truth in `app/contracts/config/types.ts`.

### 🔧 Adding a New Contract

To add a new contract to the system:

1. **Add the contract to the enum** in `app/contracts/config/types.ts`:
```typescript
export enum ContractName {
  // ... existing contracts
  YourNewContract = 'YourNewContract'
}
```

2. **Add the ABI mapping**:
```typescript
import { YOUR_NEW_CONTRACT_ABI } from '../abis/YourNewContract'

export const CONTRACT_ABI_MAPPING = {
  // ... existing mappings
  [ContractName.YourNewContract]: YOUR_NEW_CONTRACT_ABI,
}
```

3. **Add environment variable mapping**:
```typescript
export const CONTRACT_ENV_MAPPING = {
  // ... existing mappings
  [ContractName.YourNewContract]: ['NEXT_PUBLIC_YOUR_CONTRACT_ADDRESS'],
}
```

4. **Add contract addresses to your environment files** (`.env.anvil.local`, `.env.sepolia.local`, etc.):
```bash
NEXT_PUBLIC_YOUR_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

5. **Regenerate configuration**:
```bash
npx tsx scripts/generate-chain-config.ts
```

### 📋 Adding a New Schema

To add a new EAS schema:

1. **Add to the schema enum** in `app/contracts/config/types.ts`:
```typescript
export enum SchemaName {
  // ... existing schemas
  YOUR_NEW_SCHEMA = 'YourNewSchema',
}
```

2. **Add environment variable mapping**:
```typescript
export const SCHEMA_ENV_MAPPING = {
  // ... existing mappings
  [SchemaName.YOUR_NEW_SCHEMA]: 'NEXT_PUBLIC_YOUR_SCHEMA_UID',
}
```

3. **Add schema UID to environment files**:
```bash
NEXT_PUBLIC_YOUR_SCHEMA_UID=0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
```

4. **Regenerate configuration**:
```bash
npx tsx scripts/generate-chain-config.ts
```

### 🌐 Adding a New Chain

To add support for a new blockchain:

1. **Add chain configuration** in `app/contracts/config/types.ts`:
```typescript
import { yourChain } from 'viem/chains'

export const CHAIN_CONFIG_MAP = {
  // ... existing chains
  yourChain: {
    name: 'yourChain',
    id: 12345,
    chain: yourChain,
    envSuffix: 'yourChain',
  },
}
```

2. **Enable the chain** by adding it to `ACTIVE_CHAINS`:
```typescript
export const ACTIVE_CHAINS: ChainConfigKey[] = [
  // ... existing chains
  'yourChain',
]
```

3. **Create environment file** `.env.yourChain.local` with contract addresses and schema UIDs for that chain.

4. **Regenerate configuration**:
```bash
npx tsx scripts/generate-chain-config.ts
```

### 🎛️ Managing Active Chains

You can easily enable/disable chains by commenting/uncommenting in the `ACTIVE_CHAINS` array:

```typescript
export const ACTIVE_CHAINS: ChainConfigKey[] = [
  'anvil',        // ✅ Local development
  'baseSepolia',  // ✅ Testnet
  'base',         // ✅ Production
  // 'mainnet',   // ❌ Disabled
]
```

### 📁 File Structure

```
app/contracts/config/
├── types.ts                  # Single source of truth for all configuration
├── utils.ts                  # Utility functions for working with config
├── contracts.ts              # Business logic for contract objects
├── wagmi-config.ts           # Wagmi configuration
└── generated-chain-config.ts # Auto-generated (don't edit manually)

scripts/
└── generate-chain-config.ts  # Script to generate configuration
```

### 🔄 Configuration Generation

The system automatically generates type-safe configuration from your environment variables:

```bash
# Generate configuration from environment files
npx tsx scripts/generate-chain-config.ts
```

This reads all `.env.{chain}.local` files and generates `generated-chain-config.ts` with type-safe contract addresses and schema UIDs for each chain.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
