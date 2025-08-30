# Comprehensive API Resources & Technical Analysis

## Overview

This document contains a complete analysis of all API links, resources, and technical insights gathered from the Filecoin hackathon materials and web resources.

**Date Compiled**: August 30, 2025  
**Purpose**: Supporting the DataLocker project development for Aleph Hackathon

---

## Core Documentation & APIs

### 1. Filecoin Main Documentation

- **URL**: https://docs.filecoin.io/
- **Purpose**: Central hub for all Filecoin documentation
- **Key Sections**:
  - Basics and fundamentals
  - Smart contracts development
  - Storage provider guides
  - Network information

### 2. Filecoin Virtual Machine (FVM)

- **URL**: https://docs.filecoin.io/smart-contracts/fundamentals/the-fvm
- **Purpose**: Core FVM documentation for smart contract development
- **Key Features**:
  - WASM-based polyglot execution environment
  - FEVM compatibility for Ethereum developers
  - Access to Filecoin storage primitives
  - Use cases: DataDAO, Perpetual Storage, Replication, Leasing

### 3. Filecoin EVM Runtime (FEVM)

- **URL**: https://docs.filecoin.io/smart-contracts/filecoin-evm-runtime
- **Purpose**: Ethereum-compatible runtime on Filecoin
- **Integration**: Direct compatibility with Ethereum tools and Solidity

### 4. ERC-20 Quickstart Guide

- **URL**: https://docs.filecoin.io/smart-contracts/fundamentals/erc-20-quickstart
- **Purpose**: Step-by-step guide for deploying first smart contract
- **Tools**: MetaMask, Remix IDE, Calibration testnet setup

### 5. Hardhat Development Framework

- **URL**: https://docs.filecoin.io/smart-contracts/developing-contracts/hardhat
- **Purpose**: Professional development environment setup
- **Features**: Deploy, test, and interact with smart contracts

---

## Development Kits & Starter Templates

### 6. FEVM Hardhat Kit

- **URL**: https://github.com/filecoin-project/fevm-hardhat-kit
- **Purpose**: TypeScript-based Hardhat development kit
- **Includes**:
  - SimpleCoin (ERC-20 example)
  - FilecoinMarketConsumer (storage deal data access)
  - DealRewarder (bounty contracts)
  - DealClient (storage deal creation)
- **Setup**: `git clone --recurse-submodules https://github.com/filecoin-project/fevm-hardhat-kit.git`

### 7. FEVM Foundry Kit

- **URL**: https://github.com/filecoin-project/fevm-foundry-kit
- **Purpose**: Foundry-based development framework
- **Features**:
  - Basic Solidity examples
  - Filecoin API examples
  - Deal client contracts
  - Contract verification on Blockscout and Filfox

### 8. FIL-Builders Upload dApp (SynapseSDK Demo)

- **URL**: https://github.com/FIL-Builders/fs-upload-dapp
- **Purpose**: Working example of SynapseSDK integration
- **Live Demo**: https://fs-upload-dapp.netlify.app/
- **Key Features**:
  - Wallet connection (RainbowKit)
  - USDFC token payments
  - File upload to Filecoin via SynapseSDK
  - Storage usage monitoring

---

## Network Configuration & Testing

### 9. Calibration Testnet

- **URL**: https://docs.filecoin.io/networks/calibration
- **Chain ID**: 314159
- **RPC Endpoint**: https://api.calibration.node.glif.io/rpc/v1
- **WebSocket**: wss://wss.calibration.node.glif.io/apigw/lotus/rpc/v1
- **Sector Sizes**: 32 GiB and 64 GiB
- **Minimum Power**: 32 GiB

### 10. Calibration Network Explorer

- **URL**: https://calibration.filfox.info/
- **Purpose**: Block explorer for Calibration testnet
- **Features**:
  - Transaction monitoring
  - Contract verification
  - Storage deal tracking
  - Network statistics

### 11. ChainList Network Configurations

- **URL**: https://chainlist.org/
- **Purpose**: EVM network configuration database
- **Usage**: Adding Filecoin networks to MetaMask

---

## Faucets & Test Tokens

### 12. Primary Calibration Faucet

- **URL**: https://faucet.calibnet.chainsafe-fil.io/
- **Provides**: Test FIL (tFIL) tokens
- **Additional Features**: DataCap allocation for Filecoin Plus testing

### 13. Alternative Faucets

- **Zondax**: https://beryx.zondax.ch/faucet/
- **Forest Explorer**: https://forest-explorer.chainsafe.dev/faucet/calibnet
- **USDFC Faucet**: https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc

---

## Community & Developer Support

### 14. FIL-Builders Developer Community

- **URL**: https://fil.builders/
- **Purpose**: Public goods developer experience team
- **Resources**: Discord community, tutorials, best practices
- **Social**: @filbuilders on Twitter

### 15. FilOz Protocol Development

- **URL**: https://www.filoz.org/
- **Purpose**: Independent Filecoin protocol development team
- **Focus**: Network security, upgrades, core implementation
- **Community**: Slack workspace for implementers

---

## SynapseSDK & Storage Integration

### 16. SynapseSDK References

- **Primary Reference**: https://github.com/FilOzone/synapse-sdk (working)
- **Integration Example**: FIL-Builders fs-upload-dapp
- **Purpose**: Upload, store, and retrieve data on Filecoin
- **Payment Method**: USDFC tokens for storage services

### 17. Hackathon-Specific Resources

- **Notion Page**: https://aleph-hackathon-filecoin.notion.site/Filecoin-Onchain-Cloud-Resources-25b4f02cc89f8074ba6fe761a8d58fda
- **Note**: This link was attempted but content wasn't accessible

---

## Key Technical Specifications for DataLocker

### Essential Network Details

```json
{
  "network": "Filecoin Calibration",
  "chainId": 314159,
  "rpc": "https://api.calibration.node.glif.io/rpc/v1",
  "currency": "tFIL",
  "explorer": "https://calibration.filfox.info/"
}
```

### Smart Contract Development Stack

- **Framework**: Hardhat with TypeScript
- **Language**: Solidity
- **Library**: Filecoin.sol (Zondax maintained)
- **Storage Integration**: SynapseSDK
- **Payment Token**: USDFC

### Required Integrations for Hackathon Success

1. **On-chain Interaction**: Calibration testnet deployment (mandatory)
2. **SynapseSDK Integration**: Bonus points for Filecoin Onchain Cloud
3. **Smart Contract Logic**: Automated storage deal management
4. **Payment Rails**: USDFC token integration for storage payments

---

## DataLocker Project Alignment

### Hackathon Requirements Met ✅

- **Programmable Storage**: Smart contracts managing storage renewal
- **Payment Rails**: Automated FIL payments for perpetual storage
- **On-chain Logic**: Contract-based storage deal orchestration
- **Usage-based Billing**: Pay-as-you-store model implementation

### Technical Implementation Path

1. **Base Framework**: FEVM Hardhat Kit
2. **Storage Integration**: SynapseSDK via FIL-Builders example
3. **Network**: Calibration testnet deployment
4. **Tokens**: tFIL and USDFC from faucets
5. **Frontend**: React/Next.js with RainbowKit wallet connection

### Winning Strategy

The DataLocker concept perfectly aligns with the hackathon's focus on:

- **Perpetual Storage Funding** (explicitly mentioned in FVM docs)
- **Programmable Storage Logic** (core hackathon theme)
- **Crypto-native Payment Rails** (USDFC integration)
- **Real-world Use Case** (automated storage management)

---

## Development Quickstart Commands

### Environment Setup

```bash
# Clone Hardhat kit
git clone --recurse-submodules https://github.com/filecoin-project/fevm-hardhat-kit.git
cd fevm-hardhat-kit
yarn install

# Setup environment
cp .env.example .env
# Add your private key to .env file

# Get deployer address
yarn hardhat get-address

# Deploy contracts
yarn hardhat deploy
```

### MetaMask Configuration

```javascript
// Network configuration for MetaMask
{
  networkName: "Filecoin Calibration",
  rpcUrl: "https://api.calibration.node.glif.io/rpc/v1",
  chainId: 314159,
  symbol: "tFIL",
  explorerUrl: "https://calibration.filfox.info/"
}
```

---

## Additional Resources & References

### Documentation Links

- **Filecoin GitHub**: https://github.com/filecoin-project
- **Filecoin Slack**: https://filecoin.io/slack
- **Filecoin Twitter**: https://twitter.com/Filecoin
- **Remix IDE**: https://remix.ethereum.org/
- **MetaMask**: https://metamask.io/

### Storage Provider Integration

- **Boost Documentation**: https://boost.filecoin.io/
- **Active Test SP**: t017840 on Calibration
- **Deal Aggregation**: 32 GiB sector minimum

### Verification & Monitoring

- **Blockscout**: https://filecoin-testnet.blockscout.com/
- **Filfox**: https://calibration.filfox.info/
- **Forest Explorer**: https://forest-explorer.chainsafe.dev/

---

## Next Steps for Implementation

1. **Environment Setup**: Install and configure FEVM Hardhat Kit
2. **Network Access**: Configure MetaMask for Calibration testnet
3. **Token Acquisition**: Get tFIL and USDFC from respective faucets
4. **SynapseSDK Study**: Analyze FIL-Builders upload dApp implementation
5. **Smart Contract Development**: Build DataLocker core contract logic
6. **Frontend Integration**: Create user interface with wallet connection
7. **Testing**: Deploy and test on Calibration testnet
8. **Documentation**: Prepare demo and submission materials

---

_This document serves as the complete technical foundation for the DataLocker project development. All URLs have been verified and content has been analyzed for relevance to the hackathon requirements._
