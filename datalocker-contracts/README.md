# DataLocker - Perpetual Storage on Filecoin

A smart contract solution for automated, self-managing storage on the Filecoin network. DataLocker enables users to deposit FIL tokens that automatically fund storage deal renewals, creating truly perpetual storage.

## 🎯 Overview

DataLocker solves the problem of manual storage deal renewals on Filecoin by creating a smart contract that:

-   **Automatically renews storage deals** before they expire
-   **Manages user deposits** in escrow for storage funding
-   **Calculates storage costs** based on file size and duration
-   **Provides transparent tracking** of storage status and remaining funds
-   **Enables top-up functionality** for extended storage duration

## 🏆 Hackathon Features

This project was built for the Aleph Hackathon and demonstrates:

-   ✅ **Programmable Storage** - Smart contract logic manages storage deals
-   ✅ **Payment Rails** - Automated FIL payments for storage services
-   ✅ **On-chain Integration** - Deployed on Filecoin Calibration testnet
-   ✅ **Usage-based Billing** - Pay-as-you-store model with cost calculation
-   ✅ **Perpetual Storage Funding** - Automatic renewal until funds are exhausted

## 🛠 Technical Architecture

### Smart Contract Features

```solidity
// Core Functions
depositForStorage()      // Deposit FIL for storage
checkAndRenewStorage()   // Automatic renewal logic
topUpStorage()           // Add more funds
withdrawUnusedFunds()    // Reclaim unused deposits
calculateStorageCost()   // Dynamic cost calculation
```

### Key Components

-   **Storage Records** - Track user deposits, deal IDs, and expiration dates
-   **Automated Renewal** - Monitor and renew deals before expiration
-   **Cost Calculator** - Dynamic pricing based on file size and duration
-   **Escrow Management** - Secure fund handling with transparent accounting

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   Yarn package manager
-   MetaMask wallet with Calibration testnet setup

### Installation

```bash
# Clone and setup
git clone <repository-url>
cd datalocker-contracts
yarn install

# Setup environment
cp .env.example .env
# Add your private key to .env file
```

### Get the Deployer Address

Run this command:

```bash
yarn hardhat get-address
```

This will show you the ethereum-style address associated with that private key and the filecoin-style f4 address (also known as t4 address on testnets)!

### Fund the Deployer Address

Go to the [Calibrationnet testnet faucet](https://faucet.calibnet.chainsafe-fil.io/funds.html), and paste in the Ethereum address from the previous step. This will send some calibration testnet FIL to the account.

### Compilation

```bash
yarn compile
```

### Testing

```bash
yarn test
```

### Deployment to Calibration Testnet

```bash
yarn deploy:calibration
```

## 📋 Usage

### 1. Deposit for Storage

```bash
npx hardhat datalocker:deposit \
  --contract <CONTRACT_ADDRESS> \
  --cid "QmYourDataCID" \
  --size 1073741824 \
  --label "My Important Document" \
  --amount "5.0" \
  --network calibration
```

### 2. Check Storage Information

```bash
npx hardhat datalocker:info \
  --contract <CONTRACT_ADDRESS> \
  --storage-id 1 \
  --network calibration
```

### 3. Initiate Storage Deal (Owner only)

```bash
npx hardhat datalocker:initiate \
  --contract <CONTRACT_ADDRESS> \
  --storage-id 1 \
  --network calibration
```

### 4. Check and Renew Storage

```bash
npx hardhat datalocker:renew \
  --contract <CONTRACT_ADDRESS> \
  --storage-id 1 \
  --network calibration
```

## 💡 How It Works

1. **User Deposits** - Users deposit FIL along with their data CID and file information
2. **Deal Creation** - Contract owner initiates storage deals using deposited funds
3. **Automatic Monitoring** - Contract tracks deal expiration dates
4. **Smart Renewal** - Before expiration, contract automatically creates new deals
5. **Fund Management** - Users can top-up or withdraw unused funds

## 🔧 Configuration

### Network Settings

The contract is configured for Filecoin Calibration testnet:

-   **Chain ID**: 314159
-   **RPC**: https://api.calibration.node.glif.io/rpc/v1
-   **Explorer**: https://calibration.filfox.info/

### Storage Parameters

-   **Minimum Deposit**: 1 FIL
-   **Storage Duration**: 180 days (6 months)
-   **Renewal Threshold**: 30 days before expiration
-   **Base Price**: 1e15 attoFIL per epoch per GB

## 📊 Contract API

### Core Functions

| Function                 | Description                       | Access |
| ------------------------ | --------------------------------- | ------ |
| `depositForStorage()`    | Deposit FIL for perpetual storage | Public |
| `initiateStorageDeal()`  | Create initial storage deal       | Owner  |
| `checkAndRenewStorage()` | Check and renew if needed         | Public |
| `topUpStorage()`         | Add more funds to storage         | Owner  |
| `withdrawUnusedFunds()`  | Withdraw unused funds             | Owner  |
| `getStorageInfo()`       | Get storage details               | Public |
| `needsRenewal()`         | Check if renewal needed           | Public |

### Events

-   `StorageDeposited` - New storage deposit created
-   `StorageRenewed` - Storage deal renewed
-   `StorageExpired` - Storage expired due to insufficient funds
-   `FundsWithdrawn` - Unused funds withdrawn

## 🧪 Testing

The project includes comprehensive tests covering:

-   Storage deposit functionality
-   Cost calculation accuracy
-   Renewal logic validation
-   Fund management security
-   Access control verification

Run tests with:

```bash
yarn test
```

## 🔐 Security Features

-   **Access Control** - Owner-only functions for deal management
-   **Reentrancy Protection** - Safe fund withdrawal patterns
-   **Input Validation** - Comprehensive parameter checking
-   **Escrow Management** - Secure fund holding and tracking

## 🌐 Integration with Filecoin

This contract integrates with the Filecoin ecosystem through:

-   **FEVM Compatibility** - Runs on Filecoin's Ethereum Virtual Machine
-   **Filecoin APIs** - Uses Filecoin-specific storage and market APIs
-   **Storage Providers** - Compatible with Boost storage providers
-   **Network Integration** - Deployed on Calibration testnet

## 🎖 Hackathon Achievement

DataLocker demonstrates the future of decentralized storage by solving real problems:

-   **Eliminates manual renewals** - Users don't need to remember to renew storage
-   **Provides cost predictability** - Transparent pricing and fund tracking
-   **Enables true perpetual storage** - Storage continues as long as funds remain
-   **Creates storage primitives** - Building blocks for larger storage applications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions about this project, please reach out through the hackathon channels or create an issue in this repository.

---

_Built with ❤️ for the Aleph Hackathon - Demonstrating the power of programmable storage on Filecoin_
