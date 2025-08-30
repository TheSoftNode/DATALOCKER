import { expect } from "chai"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"

describe("DataLocker", function () {
    let dataLocker: any
    let mockUSDFC: any
    let owner: SignerWithAddress
    let user1: SignerWithAddress
    let user2: SignerWithAddress
    let operator: SignerWithAddress

    const testCID = ethers.hexlify(ethers.toUtf8Bytes("QmTestCID123"))
    const testSize = 1024 * 1024 * 1024 // 1 GB
    const testLabel = "Test Document"
    const testIPFS = "QmTestIPFS123"

    beforeEach(async function () {
        [owner, user1, user2, operator] = await ethers.getSigners()

        // Deploy mock USDFC token
        const MockERC20 = await ethers.getContractFactory("MockERC20")
        mockUSDFC = await MockERC20.deploy("USD Coin", "USDFC", 6) // 6 decimals for USDFC

                // Deploy DataLocker
        const DataLockerFactory = await ethers.getContractFactory("DataLocker")
        dataLocker = await DataLockerFactory.deploy(await mockUSDFC.getAddress()) as any

        // Mint some USDFC to users for testing
        await mockUSDFC.mint(user1.address, ethers.parseUnits("10000", 6)) // 10,000 USDFC
        await mockUSDFC.mint(user2.address, ethers.parseUnits("10000", 6))
    })

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await dataLocker.owner()).to.equal(owner.address)
        })

        it("Should set the correct USDFC token address", async function () {
            expect(await dataLocker.usdfc()).to.equal(await mockUSDFC.getAddress())
        })

        it("Should authorize owner as operator", async function () {
            expect(await dataLocker.authorizedOperators(owner.address)).to.be.true
        })

        it("Should start with nextStorageId = 1", async function () {
            expect(await dataLocker.nextStorageId()).to.equal(1)
        })
    })

    describe("FIL Deposits", function () {
        it("Should allow FIL deposits above minimum", async function () {
            const depositAmount = ethers.parseEther("5")

            await expect(
                dataLocker.connect(user1).depositForStorageFIL(
                    testCID,
                    testSize,
                    testLabel,
                    testIPFS,
                    { value: depositAmount }
                )
            ).to.emit(dataLocker, "StorageDeposited")
            .withArgs(1, user1.address, testCID, depositAmount, 0, testLabel, testIPFS) // 0 = FIL

            const storageInfo = await dataLocker.getStorageInfo(1)
            expect(storageInfo.user).to.equal(user1.address)
            expect(storageInfo.depositAmount).to.equal(depositAmount)
            expect(storageInfo.paymentToken).to.equal(0) // PaymentToken.FIL
        })

        it("Should reject FIL deposits below minimum", async function () {
            const depositAmount = ethers.parseEther("0.5") // Below 1 FIL minimum

            await expect(
                dataLocker.connect(user1).depositForStorageFIL(
                    testCID,
                    testSize,
                    testLabel,
                    testIPFS,
                    { value: depositAmount }
                )
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__InsufficientDeposit")
        })

        it("Should reject duplicate CID deposits", async function () {
            const depositAmount = ethers.parseEther("5")

            // First deposit should succeed
            await dataLocker.connect(user1).depositForStorageFIL(
                testCID,
                testSize,
                testLabel,
                testIPFS,
                { value: depositAmount }
            )

            // Second deposit with same CID should fail
            await expect(
                dataLocker.connect(user2).depositForStorageFIL(
                    testCID,
                    testSize,
                    "Another label",
                    testIPFS,
                    { value: depositAmount }
                )
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__StorageAlreadyExists")
        })
    })

    describe("USDFC Deposits", function () {
        it("Should allow USDFC deposits above minimum", async function () {
            const depositAmount = ethers.parseUnits("500", 6) // 500 USDFC

            // Approve USDFC transfer
            await mockUSDFC.connect(user1).approve(await dataLocker.getAddress(), depositAmount)

            await expect(
                dataLocker.connect(user1).depositForStorageUSDFC(
                    testCID,
                    testSize,
                    testLabel,
                    testIPFS,
                    depositAmount
                )
            ).to.emit(dataLocker, "StorageDeposited")
            .withArgs(1, user1.address, testCID, depositAmount, 1, testLabel, testIPFS) // 1 = USDFC

            const storageInfo = await dataLocker.getStorageInfo(1)
            expect(storageInfo.user).to.equal(user1.address)
            expect(storageInfo.depositAmount).to.equal(depositAmount)
            expect(storageInfo.paymentToken).to.equal(1) // PaymentToken.USDFC
        })

        it("Should reject USDFC deposits below minimum", async function () {
            const depositAmount = ethers.parseUnits("50", 6) // Below 100 USDFC minimum

            await mockUSDFC.connect(user1).approve(await dataLocker.getAddress(), depositAmount)

            await expect(
                dataLocker.connect(user1).depositForStorageUSDFC(
                    testCID,
                    testSize,
                    testLabel,
                    testIPFS,
                    depositAmount
                )
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__InsufficientDeposit")
        })

        it("Should fail if USDFC transfer fails", async function () {
            const depositAmount = ethers.parseUnits("500", 6)

            // Don't approve USDFC transfer
            await expect(
                dataLocker.connect(user1).depositForStorageUSDFC(
                    testCID,
                    testSize,
                    testLabel,
                    testIPFS,
                    depositAmount
                )
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__TransferFailed")
        })
    })

    describe("Operator Management", function () {
        it("Should allow owner to authorize operators", async function () {
            await expect(
                dataLocker.connect(owner).setOperatorAuthorization(operator.address, true)
            ).to.emit(dataLocker, "OperatorAuthorized")
            .withArgs(operator.address, true)

            expect(await dataLocker.authorizedOperators(operator.address)).to.be.true
        })

        it("Should allow owner to deauthorize operators", async function () {
            // First authorize
            await dataLocker.connect(owner).setOperatorAuthorization(operator.address, true)
            
            // Then deauthorize
            await expect(
                dataLocker.connect(owner).setOperatorAuthorization(operator.address, false)
            ).to.emit(dataLocker, "OperatorAuthorized")
            .withArgs(operator.address, false)

            expect(await dataLocker.authorizedOperators(operator.address)).to.be.false
        })

        it("Should reject operator authorization from non-owner", async function () {
            await expect(
                dataLocker.connect(user1).setOperatorAuthorization(operator.address, true)
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__OnlyOwner")
        })
    })

    describe("Storage Information", function () {
        beforeEach(async function () {
            const depositAmount = ethers.parseEther("5")
            await dataLocker.connect(user1).depositForStorageFIL(
                testCID,
                testSize,
                testLabel,
                testIPFS,
                { value: depositAmount }
            )
        })

        it("Should return correct storage information", async function () {
            const storageInfo = await dataLocker.getStorageInfo(1)

            expect(storageInfo.pieceCid).to.equal(testCID)
            expect(storageInfo.pieceSize).to.equal(testSize)
            expect(storageInfo.user).to.equal(user1.address)
            expect(storageInfo.label).to.equal(testLabel)
            expect(storageInfo.ipfsHash).to.equal(testIPFS)
            expect(storageInfo.isActive).to.be.false
            expect(storageInfo.paymentToken).to.equal(0) // FIL
        })

        it("Should return user storage IDs", async function () {
            const userStorageIds = await dataLocker.getUserStorageIds(user1.address)
            expect(userStorageIds).to.have.lengthOf(1)
            expect(userStorageIds[0]).to.equal(1)
        })

        it("Should find storage by CID", async function () {
            const storageId = await dataLocker.getStorageIdByCid(testCID)
            expect(storageId).to.equal(1)
        })
    })

    describe("Balance Information", function () {
        beforeEach(async function () {
            const filAmount = ethers.parseEther("5")
            const usdcAmount = ethers.parseUnits("500", 6)

            // Deposit FIL
            await dataLocker.connect(user1).depositForStorageFIL(
                testCID,
                testSize,
                testLabel,
                testIPFS,
                { value: filAmount }
            )

            // Deposit USDFC
            await mockUSDFC.connect(user2).approve(await dataLocker.getAddress(), usdcAmount)
            await dataLocker.connect(user2).depositForStorageUSDFC(
                ethers.hexlify(ethers.toUtf8Bytes("QmAnotherCID")),
                testSize,
                "Another label",
                "QmAnotherIPFS",
                usdcAmount
            )
        })

        it("Should return correct balance information", async function () {
            const balanceInfo = await dataLocker.getBalanceInfo()

            expect(balanceInfo.totalBalanceFIL).to.equal(ethers.parseEther("5"))
            expect(balanceInfo.escrowBalanceFIL).to.equal(ethers.parseEther("5"))
            expect(balanceInfo.availableBalanceFIL).to.equal(0)

            expect(balanceInfo.totalBalanceUSDFC).to.equal(ethers.parseUnits("500", 6))
            expect(balanceInfo.escrowBalanceUSDFC).to.equal(ethers.parseUnits("500", 6))
            expect(balanceInfo.availableBalanceUSDFC).to.equal(0)
        })
    })

    describe("Renewal Queue", function () {
        it("Should return empty queue when no storage needs renewal", async function () {
            const renewalQueue = await dataLocker.getRenewalQueue()
            expect(renewalQueue).to.have.lengthOf(0)
        })

        it("Should identify storage that needs renewal", async function () {
            // Create storage that needs renewal by manipulating time
            const depositAmount = ethers.parseEther("5")
            await dataLocker.connect(user1).depositForStorageFIL(
                testCID,
                testSize,
                testLabel,
                testIPFS,
                { value: depositAmount }
            )

            // For testing, we'd need to simulate an active storage with near expiration
            // This would require additional setup or mocking
        })
    })

    describe("Access Control", function () {
        it("Should allow only storage owner to withdraw funds", async function () {
            const depositAmount = ethers.parseEther("5")
            await dataLocker.connect(user1).depositForStorageFIL(
                testCID,
                testSize,
                testLabel,
                testIPFS,
                { value: depositAmount }
            )

            await expect(
                dataLocker.connect(user2).withdrawUnusedFunds(1)
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__NotOwnerOfStorage")
        })

        it("Should reject operations on non-existent storage", async function () {
            await expect(
                dataLocker.getStorageInfo(999)
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__StorageNotFound")
        })
    })

    describe("SynapseSDK Integration", function () {
        it("Should allow owner to set SynapseSDK address", async function () {
            const mockSynapseAddress = ethers.Wallet.createRandom().address

            await expect(
                dataLocker.connect(owner).setSynapseSDK(mockSynapseAddress)
            ).to.emit(dataLocker, "SynapseSDKUpdated")
            .withArgs(ethers.ZeroAddress, mockSynapseAddress)

            expect(await dataLocker.synapseSDK()).to.equal(mockSynapseAddress)
        })

        it("Should reject SynapseSDK updates from non-owner", async function () {
            const mockSynapseAddress = ethers.Wallet.createRandom().address

            await expect(
                dataLocker.connect(user1).setSynapseSDK(mockSynapseAddress)
            ).to.be.revertedWithCustomError(dataLocker, "DataLockerV2__OnlyOwner")
        })
    })

    describe("Current Epoch", function () {
        it("Should return current epoch based on block timestamp", async function () {
            const currentEpoch = await dataLocker.getCurrentEpoch()
            const expectedEpoch = (await ethers.provider.getBlock("latest"))!.timestamp / 30
            
            expect(Number(currentEpoch)).to.be.approximately(expectedEpoch, 1)
        })
    })
})
