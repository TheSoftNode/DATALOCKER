# 🚀 DataLocker - Perpetual Storage on Filecoin

[![Hackathon](https://img.shields.io/badge/Hackathon-Aleph%202025-blue.svg)](https://hackathon.link)
[![FEVM](https://img.shields.io/badge/Built%20on-FEVM-green.svg)](https://docs.filecoin.io/smart-contracts/fundamentals/the-fvm)
[![SynapseSDK](https://img.shields.io/badge/Powered%20by-SynapseSDK-orange.svg)](https://github.com/FIL-Builders/synapse-sdk)

**The first perpetual, self-managing storage solution on Filecoin with automated renewals.**

## 🎯 **What is DataLocker?**

DataLocker solves the critical problem of storage deal expiration on Filecoin. Instead of manually renewing storage every 6 months, users deposit FIL or USDFC once and our smart contract automatically manages renewals, ensuring their files remain permanently stored.

## ✨ **Key Features**

- 🔄 **Automated Renewals**: Set-and-forget 6-month perpetual storage
- 💰 **Multi-token Payments**: Support for both FIL and USDFC
- 📊 **Real-time Monitoring**: Track storage status and expiration dates
- 🔒 **Secure Escrow**: Smart contract manages funds securely
- 🎨 **Professional UI**: Modern, responsive interface
- ⚡ **Real Integration**: Production SynapseSDK patterns (no mock data!)

## 🏗 **Architecture**

```
Frontend (Next.js 15)  ←→  Smart Contract (FEVM)  ←→  SynapseSDK (Pandora)
     │                           │                         │
  • File Upload              • Escrow Mgmt              • Storage Deals
  • Wallet UI                • Auto Renewal             • Cost Calculation
  • Real-time Updates        • Multi-token Support      • Provider Management
```

## 🚀 **Live Demo**

**Contract**: `0x5b4495F43501842C513afef03e581f0791fDe406` (Calibration Testnet)  
**Frontend**: `http://localhost:3001`

### **Try it yourself:**

1. Connect wallet to Filecoin Calibration testnet
2. Get USDFC from faucet: [USDFC Faucet](https://faucet.filecoin.io)
3. Upload a file and select FIL or USDFC payment
4. Watch automated storage management in action!

## 🛠 **Technology Stack**

- **Blockchain**: Filecoin (FEVM) Calibration Testnet
- **Smart Contracts**: Solidity ^0.8.23, Hardhat
- **Frontend**: Next.js 15, React 19, TypeScript
- **Web3**: Wagmi, RainbowKit, ethers.js
- **Storage**: SynapseSDK, Pandora Service
- **UI**: Tailwind CSS, Framer Motion
- **Payments**: USDFC Token, FIL

## 📁 **Project Structure**

```
DataLocker/
├── datalocker-contracts/     # Smart contracts (Hardhat)
│   ├── contracts/
│   │   ├── DataLocker.sol   # Main perpetual storage contract
│   │   └── interfaces/      # Real SynapseSDK interfaces
│   └── deploy/              # Deployment scripts
├── datalocker-ui/           # Frontend (Next.js)
│   ├── components/          # React components
│   ├── hooks/               # Contract interaction hooks
│   └── config.ts            # Production configuration
└── resources/               # Hackathon documentation
```

## 🔧 **Development Setup**

### **Prerequisites**

- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### **Quick Start**

```bash
# Clone the repository
git clone https://github.com/TheSoftNode/DATALOCKER.git
cd DATALOCKER

# Install contract dependencies
cd datalocker-contracts
npm install

# Install frontend dependencies
cd ../datalocker-ui
npm install

# Start the frontend
npm run dev
```

### **Contract Deployment**

```bash
cd datalocker-contracts
npm run deploy:calibration
```

## 🔗 **Production Addresses (Calibration Testnet)**

All addresses are **real production contracts** (no mock data):

```typescript
DATALOCKER_CONTRACT: "0x5b4495F43501842C513afef03e581f0791fDe406";
USDFC_TOKEN: "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0";
PAYMENTS_CONTRACT: "0x0E690D3e60B0576D01352AB03b258115eb84A047";
PANDORA_SERVICE: "0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5";
```

## 🎮 **Usage**

### **1. Upload File for Perpetual Storage**

```typescript
// Deposit FIL for 6-month perpetual storage
await contract.depositForStorageFIL(
  pieceCid, // File content identifier
  pieceSize, // File size in bytes
  "My File", // Human-readable label
  ipfsHash, // IPFS hash for metadata
  { value: ethers.parseEther("1.0") }
);
```

### **2. Upload with USDFC**

```typescript
// Deposit USDFC for perpetual storage
await contract.depositForStorageUSDFC(
  pieceCid,
  pieceSize,
  "My File",
  ipfsHash,
  ethers.parseUnits("5", 6) // 5 USDFC
);
```

### **3. Monitor Storage**

```typescript
// Get user's storage records
const storageIds = await contract.getUserStorageIds(userAddress);
const storageInfo = await contract.getStorageInfo(storageIds[0]);
```

## 🔒 **Security Features**

- **Secure Escrow**: Funds locked in smart contract
- **Withdrawal Protection**: Only unused funds can be withdrawn
- **Owner Controls**: Contract upgrades restricted to owner
- **Real Integration**: Production-tested SynapseSDK patterns

## 📊 **Smart Contract Features**

- **Automated Renewals**: Check and renew storage before expiration
- **Multi-token Support**: Accept both FIL and USDFC payments
- **Batch Operations**: Process multiple renewals efficiently
- **Cost Optimization**: Real-time pricing from Pandora service
- **Event Logging**: Comprehensive event emission for frontend

## 🏆 **Hackathon Achievements**

- ✅ **Real SynapseSDK Integration**: Production patterns, no mock data
- ✅ **Complete dApp**: Full-stack solution ready for deployment
- ✅ **Innovation**: First perpetual storage solution on Filecoin
- ✅ **Professional Quality**: 380+ lines of production Solidity
- ✅ **User Experience**: Modern UI with real-time updates

## 📈 **Future Roadmap**

- [ ] Mainnet deployment
- [ ] Advanced storage tiers
- [ ] Enterprise API
- [ ] Mobile app
- [ ] Multi-chain support

## 🤝 **Contributing**

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md).

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Aleph Hackathon** for the opportunity
- **Filecoin Foundation** for FEVM
- **SynapseSDK team** for the amazing toolkit
- **Protocol Labs** for the Filecoin ecosystem

---

**Built with ❤️ for Aleph Hackathon 2025**

[🌐 Repository](https://github.com/TheSoftNode/DATALOCKER) | [📖 Documentation](./HACKATHON_SUBMISSION.md) | [🎬 Demo Video](./DEMO_SCRIPT.md)
