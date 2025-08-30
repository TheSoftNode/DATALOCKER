import { task } from "hardhat/config"
import { HardhatRuntimeEnvironment } from "hardhat/types"

// Task to deposit FIL for storage
task("datalocker:deposit-fil", "Deposit FIL for perpetual storage")
    .addParam("contract", "DataLocker contract address")
    .addParam("cid", "Piece CID (as hex string)")
    .addParam("size", "Piece size in bytes")
    .addParam("label", "Human readable label for the data")
    .addParam("ipfs", "IPFS hash for metadata")
    .addParam("amount", "Amount to deposit in FIL")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        console.log("====================================================")
        console.log("Depositing FIL for storage...")
        console.log("====================================================")
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        const pieceCid = ethers.hexlify(ethers.toUtf8Bytes(taskArgs.cid))
        const depositAmount = ethers.parseEther(taskArgs.amount)
        
        console.log(`Piece CID: ${taskArgs.cid}`)
        console.log(`Piece Size: ${taskArgs.size} bytes`)
        console.log(`Label: ${taskArgs.label}`)
        console.log(`IPFS Hash: ${taskArgs.ipfs}`)
        console.log(`Deposit Amount: ${taskArgs.amount} FIL`)
        console.log(`From: ${signer.address}`)
        
        const tx = await dataLocker.depositForStorageFIL(
            pieceCid,
            taskArgs.size,
            taskArgs.label,
            taskArgs.ipfs,
            { value: depositAmount }
        )
        
        console.log(`Transaction hash: ${tx.hash}`)
        const receipt = await tx.wait()
        
        // Extract storage ID from events
        const depositEvent = receipt?.logs?.find((log: any) => 
            log.eventName === "StorageDeposited" || 
            (log.fragment && log.fragment.name === "StorageDeposited")
        ) as any
        if (depositEvent && depositEvent.args) {
            console.log(`Storage ID: ${depositEvent.args.storageId.toString()}`)
            console.log(`Payment Token: FIL`)
        }
        
        console.log("✅ FIL deposit successful!")
    })

// Task to deposit USDFC for storage
task("datalocker:deposit-usdfc", "Deposit USDFC for perpetual storage")
    .addParam("contract", "DataLocker contract address")
    .addParam("usdfc", "USDFC token contract address")
    .addParam("cid", "Piece CID (as hex string)")
    .addParam("size", "Piece size in bytes")
    .addParam("label", "Human readable label for the data")
    .addParam("ipfs", "IPFS hash for metadata")
    .addParam("amount", "Amount to deposit in USDFC (with decimals)")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        console.log("====================================================")
        console.log("Depositing USDFC for storage...")
        console.log("====================================================")
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        const usdfc = await ethers.getContractAt("IERC20", taskArgs.usdfc, signer)
        
        const pieceCid = ethers.hexlify(ethers.toUtf8Bytes(taskArgs.cid))
        const depositAmount = ethers.parseUnits(taskArgs.amount, 6) // USDFC has 6 decimals
        
        console.log(`Piece CID: ${taskArgs.cid}`)
        console.log(`Piece Size: ${taskArgs.size} bytes`)
        console.log(`Label: ${taskArgs.label}`)
        console.log(`IPFS Hash: ${taskArgs.ipfs}`)
        console.log(`Deposit Amount: ${taskArgs.amount} USDFC`)
        console.log(`From: ${signer.address}`)
        
        // First approve USDFC transfer
        console.log("Approving USDFC transfer...")
        const approveTx = await usdfc.approve(taskArgs.contract, depositAmount)
        await approveTx.wait()
        console.log("✅ USDFC approved")
        
        // Deposit for storage
        const tx = await dataLocker.depositForStorageUSDFC(
            pieceCid,
            taskArgs.size,
            taskArgs.label,
            taskArgs.ipfs,
            depositAmount
        )
        
        console.log(`Transaction hash: ${tx.hash}`)
        const receipt = await tx.wait()
        
        // Extract storage ID from events
        const depositEvent = receipt?.logs?.find((log: any) => 
            log.eventName === "StorageDeposited" || 
            (log.fragment && log.fragment.name === "StorageDeposited")
        ) as any
        if (depositEvent && depositEvent.args) {
            console.log(`Storage ID: ${depositEvent.args.storageId.toString()}`)
            console.log(`Payment Token: USDFC`)
        }
        
        console.log("✅ USDFC deposit successful!")
    })

// Task to set Pandora service address
task("datalocker:set-pandora", "Set Pandora service contract address")
    .addParam("contract", "DataLocker contract address")
    .addParam("pandora", "Pandora service contract address")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        console.log("====================================================")
        console.log("Setting Pandora service address...")
        console.log("====================================================")
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        console.log(`Pandora Address: ${taskArgs.pandora}`)
        
        const tx = await dataLocker.setPandoraService(taskArgs.pandora)
        console.log(`Transaction hash: ${tx.hash}`)
        
        await tx.wait()
        console.log("✅ Pandora service address updated!")
    })

// Task to authorize operators
task("datalocker:authorize", "Authorize/deauthorize operators")
    .addParam("contract", "DataLocker contract address")
    .addParam("operator", "Operator address to authorize/deauthorize")
    .addParam("authorized", "true to authorize, false to deauthorize")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        console.log("====================================================")
        console.log("Managing operator authorization...")
        console.log("====================================================")
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        const authorized = taskArgs.authorized === "true"
        console.log(`Operator: ${taskArgs.operator}`)
        console.log(`Action: ${authorized ? "Authorize" : "Deauthorize"}`)
        
        const tx = await dataLocker.setOperatorAuthorization(taskArgs.operator, authorized)
        console.log(`Transaction hash: ${tx.hash}`)
        
        await tx.wait()
        console.log(`✅ Operator ${authorized ? "authorized" : "deauthorized"}!`)
    })

// Task to get renewal queue
task("datalocker:renewal-queue", "Get storage records that need renewal")
    .addParam("contract", "DataLocker contract address")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        try {
            const renewalQueue = await dataLocker.getRenewalQueue()
            
            console.log("====================================================")
            console.log("Storage Records Needing Renewal")
            console.log("====================================================")
            
            if (renewalQueue.length === 0) {
                console.log("No storage records need renewal at this time")
            } else {
                console.log(`Found ${renewalQueue.length} storage record(s) needing renewal:`)
                
                for (let i = 0; i < renewalQueue.length; i++) {
                    const storageId = renewalQueue[i].toString()
                    console.log(`\n📦 Storage ID: ${storageId}`)
                    
                    try {
                        const info = await dataLocker.getStorageInfo(storageId)
                        console.log(`   User: ${info.user}`)
                        console.log(`   Label: ${info.label}`)
                        console.log(`   Payment Token: ${info.paymentToken === 0n ? "FIL" : "USDFC"}`)
                        console.log(`   Expires at epoch: ${info.expirationEpoch.toString()}`)
                        
                        const currentEpoch = await dataLocker.getCurrentEpoch()
                        const epochsLeft = info.expirationEpoch > currentEpoch 
                            ? info.expirationEpoch - currentEpoch 
                            : 0n
                        const daysLeft = Number(epochsLeft) / 2880 // 2880 epochs per day
                        console.log(`   Days until expiry: ${daysLeft.toFixed(2)}`)
                    } catch (error) {
                        console.log(`   Error fetching details: ${error}`)
                    }
                }
            }
            
        } catch (error) {
            console.error("Error fetching renewal queue:", error)
        }
    })

// Task to batch process renewals
task("datalocker:batch-renew", "Batch process renewals for storage records")
    .addParam("contract", "DataLocker contract address")
    .addOptionalParam("ids", "Comma-separated list of storage IDs (if not provided, uses renewal queue)")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        console.log("====================================================")
        console.log("Batch processing renewals...")
        console.log("====================================================")
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        let storageIds: string[]
        
        if (taskArgs.ids) {
            storageIds = taskArgs.ids.split(",").map((id: string) => id.trim())
        } else {
            console.log("Getting renewal queue...")
            const renewalQueue = await dataLocker.getRenewalQueue()
            storageIds = renewalQueue.map((id: any) => id.toString())
        }
        
        if (storageIds.length === 0) {
            console.log("No storage records to process")
            return
        }
        
        console.log(`Processing ${storageIds.length} storage record(s): ${storageIds.join(", ")}`)
        
        try {
            const tx = await dataLocker.batchProcessRenewals(storageIds)
            console.log(`Transaction hash: ${tx.hash}`)
            
            const receipt = await tx.wait()
            console.log("✅ Batch renewal processing completed!")
            
            // Check for renewal events
            const renewalEvents = receipt?.logs?.filter((log: any) => 
                log.eventName === "StorageRenewed" || 
                (log.fragment && log.fragment.name === "StorageRenewed")
            ) as any[]
            
            const expirationEvents = receipt?.logs?.filter((log: any) => 
                log.eventName === "StorageExpired" || 
                (log.fragment && log.fragment.name === "StorageExpired")
            ) as any[]
            
            if (renewalEvents && renewalEvents.length > 0) {
                console.log(`\n✅ ${renewalEvents.length} storage record(s) renewed successfully`)
            }
            
            if (expirationEvents && expirationEvents.length > 0) {
                console.log(`\n⚠️  ${expirationEvents.length} storage record(s) expired due to insufficient funds`)
            }
            
        } catch (error) {
            console.error("Error processing batch renewals:", error)
        }
    })

// Task to get enhanced balance information
task("datalocker:balance", "Get contract balance information for both FIL and USDFC")
    .addParam("contract", "DataLocker contract address")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        try {
            const balanceInfo = await dataLocker.getBalanceInfo()
            
            console.log("====================================================")
            console.log("Contract Balance Information")
            console.log("====================================================")
            
            console.log("\n💰 FIL Balances:")
            console.log(`Total Balance: ${ethers.formatEther(balanceInfo.totalBalanceFIL)} FIL`)
            console.log(`Escrow Balance: ${ethers.formatEther(balanceInfo.escrowBalanceFIL)} FIL`)
            console.log(`Available Balance: ${ethers.formatEther(balanceInfo.availableBalanceFIL)} FIL`)
            
            console.log("\n💵 USDFC Balances:")
            console.log(`Total Balance: ${ethers.formatUnits(balanceInfo.totalBalanceUSDFC, 6)} USDFC`)
            console.log(`Escrow Balance: ${ethers.formatUnits(balanceInfo.escrowBalanceUSDFC, 6)} USDFC`)
            console.log(`Available Balance: ${ethers.formatUnits(balanceInfo.availableBalanceUSDFC, 6)} USDFC`)
            
        } catch (error) {
            console.error("Error fetching balance info:", error)
        }
    })

// Enhanced info task for V2
task("datalocker:info", "Get enhanced storage information")
    .addParam("contract", "DataLocker contract address")
    .addParam("storageId", "Storage ID to query")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers } = hre
        const [signer] = await ethers.getSigners()
        
        const dataLocker = await ethers.getContractAt("DataLocker", taskArgs.contract, signer)
        
        try {
            const storageInfo = await dataLocker.getStorageInfo(taskArgs.storageId)
            const needsRenewal = await dataLocker.needsRenewal(taskArgs.storageId)
            const currentEpoch = await dataLocker.getCurrentEpoch()
            
            console.log("====================================================")
            console.log("Enhanced Storage Information")
            console.log("====================================================")
            console.log(`Storage ID: ${taskArgs.storageId}`)
            console.log(`Owner: ${storageInfo.user}`)
            console.log(`Label: ${storageInfo.label}`)
            console.log(`IPFS Hash: ${storageInfo.ipfsHash}`)
            console.log(`Piece Size: ${storageInfo.pieceSize.toString()} bytes`)
            
            const paymentToken = storageInfo.paymentToken === 0n ? "FIL" : "USDFC"
            console.log(`Payment Token: ${paymentToken}`)
            
            if (paymentToken === "FIL") {
                console.log(`Deposited: ${ethers.formatEther(storageInfo.depositAmount)} FIL`)
                console.log(`Used: ${ethers.formatEther(storageInfo.usedAmount)} FIL`)
                console.log(`Remaining: ${ethers.formatEther(storageInfo.depositAmount - storageInfo.usedAmount)} FIL`)
            } else {
                console.log(`Deposited: ${ethers.formatUnits(storageInfo.depositAmount, 6)} USDFC`)
                console.log(`Used: ${ethers.formatUnits(storageInfo.usedAmount, 6)} USDFC`)
                console.log(`Remaining: ${ethers.formatUnits(storageInfo.depositAmount - storageInfo.usedAmount, 6)} USDFC`)
            }
            
            console.log(`Active: ${storageInfo.isActive}`)
            console.log(`Deal ID: ${storageInfo.dealId}`)
            console.log(`Expiration Epoch: ${storageInfo.expirationEpoch.toString()}`)
            console.log(`Last Renewal Epoch: ${storageInfo.lastRenewalEpoch.toString()}`)
            console.log(`Current Epoch: ${currentEpoch.toString()}`)
            
            if (storageInfo.isActive && storageInfo.expirationEpoch > 0n) {
                const epochsLeft = storageInfo.expirationEpoch > currentEpoch 
                    ? storageInfo.expirationEpoch - currentEpoch 
                    : 0n
                const daysLeft = Number(epochsLeft) / 2880 // 2880 epochs per day
                console.log(`Days until expiry: ${daysLeft.toFixed(2)}`)
            }
            
            console.log(`Needs Renewal: ${needsRenewal}`)
            
        } catch (error) {
            console.error("Error fetching storage info:", error)
        }
    })
