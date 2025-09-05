# 🚀 DataLocker - Autonomous Perpetual Storage on Filecoin

[![Kwala Integration](https://img.shields.io/badge/🤖_Kwala-Autonomous_Storage-purple.svg)](https://kwala.network/)
[![Technical Docs](https://img.shields.io/badge/📚_Technical-Specification-blue.svg)](./TECHNICAL_SPECIFICATION.md)
[![Workflows](https://img.shields.io/badge/🔄_Kwala-Workflows-green.svg)](./kwala-workflows/)
[![FEVM](https://img.shields.io/badge/Built%20on-FEVM-orange.svg)](https://docs.filecoin.io/smart-contracts/fundamentals/the-fvm)
[![SynapseSDK](https://img.shields.io/badge/Powered%20by-SynapseSDK-red.svg)](https://github.com/FIL-Builders/synapse-sdk)

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

**🌐 Live App**: **https://datalocker.vercel.app/**  
**📋 Contract**: `0x5b4495F43501842C513afef03e581f0791fDe406` (Calibration Testnet)

## 📖 **How to Use DataLocker**

### **Step 1: Connect Your Wallet**

1. Visit **https://datalocker.vercel.app/**
2. Click "Connect Wallet" and select your wallet (MetaMask recommended)
3. Switch to **Filecoin Calibration Testnet** when prompted

### **Step 2: Get Test Tokens**

- **FIL**: Get from [Calibration Faucet](https://faucet.calibnet.chainsafe-fil.io/)
- **USDFC**: Get from [USDFC Faucet](https://faucet.filecoin.io) (5 USDFC minimum required)

### **Step 3: Activate Storage (IMPORTANT)**

🚨 **Before uploading files, you MUST activate storage:**

1. Go to the **"Actions"** section in the dashboard
2. Find **"Initiate Storage Deal"**
3. Use approximately **0.017 tokens** (FIL or USDFC) to activate
4. This sets up your storage capacity with the SynapseSDK
5. Wait for activation confirmation

### **Step 4: Upload Files**

1. Click **"Upload File"** or drag & drop
2. Select your file (any type supported)
3. Choose payment method: **FIL** or **USDFC**
4. Add a label for your file
5. Confirm the transaction
6. Your file is now stored with **6-month automatic renewal**!

### **Step 5: Monitor Storage**

- View all your files in **"My Storage"**
- Check expiration dates and renewal status
- Monitor storage balance and usage
- Withdraw unused funds when needed

## ⚠️ **Important Notes**

- **Activation Required**: You must use the Actions section to initiate storage before uploading
- **Minimum Deposits**: 1 FIL or 5 USDFC required
- **Auto-Renewal**: Files automatically renew if sufficient funds available
- **Testnet Only**: Currently deployed on Calibration testnet

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

## 🤖 **Kwala Integration - Autonomous Storage Revolution**

**DataLocker + Kwala** creates the **first truly autonomous storage system** on Filecoin:

### **🚀 What Makes This Special**
- ✅ **Zero Maintenance**: Users upload once, files stored forever - no manual renewals
- ✅ **Decentralized Automation**: Kwala handles all renewals automatically via smart contracts
- ✅ **Proactive Monitoring**: Discord notifications before issues occur
- ✅ **Production Ready**: 4 comprehensive Kwala workflows deployed and tested

### **🔧 Enhanced Smart Contract**
- **5 new functions** optimized specifically for Kwala automation
- **3 new events** enabling real-time automation workflows  
- **Gas-optimized batch processing** for handling thousands of renewals
- **Comprehensive error handling** with detailed automation feedback

### **📋 Complete Technical Documentation**
**👉 [Read Full Technical Specification](./TECHNICAL_SPECIFICATION.md)** - Comprehensive 13,000+ word technical deep-dive covering:
- Smart contract enhancements and automation functions
- Complete Kwala workflow architecture and implementation
- Event-driven automation with real-time responsiveness  
- Security, scalability, and performance specifications
- Deployment strategies and monitoring systems

### **🎯 Kwala Workflows**
1. **Automated Renewal** (every 30 minutes) - Finds and renews expiring storage
2. **Low Balance Alerts** (event-driven) - Instant notifications when storage expires
3. **Proactive Monitoring** (every 6 hours) - Warns users before balance runs low
4. **Deal Expiration Warnings** (event-driven) - Early alerts with auto-renewal attempts

**📁 View Workflows:** [kwala-workflows/](./kwala-workflows/)

## 🏆 **Hackathon Achievements**

- ✅ **Revolutionary Innovation**: First autonomous storage system on any blockchain
- ✅ **Production-Grade Integration**: Real Kwala workflows with comprehensive automation  
- ✅ **Complete dApp**: Full-stack solution with live deployment
- ✅ **Real SynapseSDK Integration**: Production patterns, no mock data
- ✅ **Technical Excellence**: 380+ lines of production Solidity + 4 automation workflows
- ✅ **User Experience**: Zero-maintenance storage with proactive notifications

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

[🌐 Live Demo](https://datalocker.vercel.app/) | [📂 Repository](https://github.com/TheSoftNode/DATALOCKER) | [📖 Documentation](./HACKATHON_SUBMISSION.md)
