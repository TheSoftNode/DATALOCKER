import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

/**
 * @title DataLocker Deployment Script
 * @notice Deploys DataLocker contract with real SynapseSDK integration
 * @dev Production-ready deployment following fs-upload-dapp patterns
 * @author DataLocker Team - Aleph Hackathon 2025
 * 
 * PRODUCTION ADDRESSES (Calibration Testnet):
 * - USDFC Token: 0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0
 * - Payments Contract: 0x0E690D3e60B0576D01352AB03b258115eb84A047  
 * - Pandora Service: 0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5
 * - PDP Verifier: 0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC
 */

// Real production addresses from SynapseSDK (Calibration testnet)
const PRODUCTION_ADDRESSES = {
    USDFC_TOKEN: "0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0",
    PAYMENTS_CONTRACT: "0x0E690D3e60B0576D01352AB03b258115eb84A047",
    PANDORA_SERVICE: "0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5",
    PDP_VERIFIER: "0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC"
}

// Frontend-friendly configuration (following dApp patterns)
const FRONTEND_CONFIG = {
    storageCapacity: 10, // GB - matches dApp default
    persistencePeriod: 30, // days - matches dApp default  
    minDaysThreshold: 10, // days - matches dApp default
    withCDN: true, // Enable CDN for faster retrieval
    renewalThreshold: 30, // days before expiry to trigger renewal
    storageDuration: 180, // days (6 months)
    epochsPerDay: 2880, // 30-second epochs per day
}

const deployDataLocker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre
    const { deploy, log, save } = deployments

    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("📋 Starting DataLocker deployment...")
    log(`🌐 Network: ${network.name}`)
    log(`💼 Deployer: ${deployer}`)
    log("----------------------------------------------------")
    
    log("🔗 Using PRODUCTION SynapseSDK addresses:")
    log(`   USDFC Token: ${PRODUCTION_ADDRESSES.USDFC_TOKEN}`)
    log(`   Payments: ${PRODUCTION_ADDRESSES.PAYMENTS_CONTRACT}`)
    log(`   Pandora: ${PRODUCTION_ADDRESSES.PANDORA_SERVICE}`)
    log(`   PDP Verifier: ${PRODUCTION_ADDRESSES.PDP_VERIFIER}`)

    // Verify network compatibility
    if (network.name !== "calibration" && network.name !== "localhost" && network.name !== "hardhat") {
        log("⚠️  WARNING: Deploying to non-Calibration network with Calibration addresses!")
    }

    // Deploy DataLocker contract (no constructor args - all addresses are constants)
    const dataLocker = await deploy("DataLocker", {
        from: deployer,
        args: [], // No constructor arguments - using production constants
        log: true,
        autoMine: true,
        waitConfirmations: network.name === "localhost" || network.name === "hardhat" ? 1 : 2,
    })

    log(`✅ DataLocker deployed to: ${dataLocker.address}`)

    // Get contract instance for post-deployment setup
    const dataLockerContract = await ethers.getContractAt("DataLocker", dataLocker.address)

    // Verify contract is properly initialized
    try {
        const owner = await dataLockerContract.owner()
        const usdfc = await dataLockerContract.USDFC_TOKEN()
        const payments = await dataLockerContract.PAYMENTS_CONTRACT()
        const pandora = await dataLockerContract.PANDORA_SERVICE()
        
        log("🔍 Contract verification:")
        log(`   Owner: ${owner}`)
        log(`   USDFC Token: ${usdfc}`)
        log(`   Payments Contract: ${payments}`)
        log(`   Pandora Service: ${pandora}`)

        // Verify addresses match production
        if (usdfc !== PRODUCTION_ADDRESSES.USDFC_TOKEN) {
            throw new Error(`USDFC address mismatch! Expected: ${PRODUCTION_ADDRESSES.USDFC_TOKEN}, Got: ${usdfc}`)
        }
        if (payments !== PRODUCTION_ADDRESSES.PAYMENTS_CONTRACT) {
            throw new Error(`Payments address mismatch! Expected: ${PRODUCTION_ADDRESSES.PAYMENTS_CONTRACT}, Got: ${payments}`)
        }
        if (pandora !== PRODUCTION_ADDRESSES.PANDORA_SERVICE) {
            throw new Error(`Pandora address mismatch! Expected: ${PRODUCTION_ADDRESSES.PANDORA_SERVICE}, Got: ${pandora}`)
        }

        log("✅ All production addresses verified!")

    } catch (error) {
        log(`❌ Contract verification failed: ${error}`)
        throw error
    }

    // Save frontend configuration
    const frontendDeployment = {
        address: dataLocker.address,
        abi: dataLocker.abi,
        productionAddresses: PRODUCTION_ADDRESSES,
        config: FRONTEND_CONFIG,
        network: network.name,
        chainId: network.config.chainId,
        deployedAt: new Date().toISOString(),
        deployer: deployer,
        txHash: dataLocker.transactionHash,
        blockNumber: dataLocker.receipt?.blockNumber,
        gasUsed: dataLocker.receipt?.gasUsed?.toString(),
    }

    // Save frontend-ready deployment info
    await save("DataLockerFrontend", frontendDeployment)

    log("----------------------------------------------------")
    log("📋 Frontend Configuration:")
    log(`   Contract: ${dataLocker.address}`)
    log(`   Storage Capacity: ${FRONTEND_CONFIG.storageCapacity} GB`)
    log(`   Persistence Period: ${FRONTEND_CONFIG.persistencePeriod} days`)
    log(`   CDN Enabled: ${FRONTEND_CONFIG.withCDN}`)
    log(`   Renewal Threshold: ${FRONTEND_CONFIG.renewalThreshold} days`)

    // Contract verification on block explorer
    if (network.name !== "hardhat" && network.name !== "localhost") {
        log("⏳ Waiting for confirmations before verification...")
        await new Promise(resolve => setTimeout(resolve, 60000)) // Wait 1 minute
        
        try {
            await hre.run("verify:verify", {
                address: dataLocker.address,
                constructorArguments: [],
            })
            log("✅ Contract verified on block explorer")
        } catch (error) {
            log(`⚠️  Verification failed: ${error}`)
        }
    }

    log("----------------------------------------------------")
    log("🎉 DataLocker deployment completed successfully!")
    log(`📝 Contract Address: ${dataLocker.address}`)
    log(`🌐 Network: ${network.name}`)
    log(`⛽ Gas Used: ${dataLocker.receipt?.gasUsed?.toString()}`)
    log("🔗 Ready for frontend integration with real SynapseSDK!")
    log("----------------------------------------------------")
    log("📝 Next steps:")
    log("1. ✅ Contract deployed with production SynapseSDK addresses")
    log("2. ✅ Frontend config saved for dApp integration")
    log("3. 🔄 Test deposit and renewal functions")
    log("4. 🌐 Deploy frontend application") 
    log("5. 🚀 Connect to real Filecoin storage providers")
    log("----------------------------------------------------")

    return true
}

export default deployDataLocker
deployDataLocker.tags = ["DataLocker", "all"]
deployDataLocker.dependencies = []
