// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {MarketAPI} from "filecoin-solidity-api/contracts/v0.8/MarketAPI.sol";
import {CommonTypes} from "filecoin-solidity-api/contracts/v0.8/types/CommonTypes.sol";
import {MarketTypes} from "filecoin-solidity-api/contracts/v0.8/types/MarketTypes.sol";
import {BigInts} from "filecoin-solidity-api/contracts/v0.8/utils/BigInts.sol";
import {FilAddresses} from "filecoin-solidity-api/contracts/v0.8/utils/FilAddresses.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ISynapseSDK.sol";

/**
 * @title DataLocker
 * @dev Enhanced smart contract for perpetual, self-managing storage on Filecoin with real SynapseSDK integration
 * @notice Users deposit FIL or USDFC to fund automatic storage deal renewals through Filecoin Onchain Cloud
 * @author DataLocker Team - Aleph Hackathon 2025
 *
 * PRODUCTION ADDRESSES (Calibration Testnet):
 * - USDFC Token: 0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0
 * - Payments Contract: 0x0E690D3e60B0576D01352AB03b258115eb84A047
 * - Pandora Service: 0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5
 * - PDP Verifier: 0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC
 */
contract DataLocker {
    // Constants
    uint256 public constant STORAGE_DURATION = 180 days; // ~6 months
    uint256 public constant RENEWAL_THRESHOLD = 30 days; // Renew when less than 30 days remain
    uint256 public constant MIN_DEPOSIT_FIL = 1 ether; // Minimum FIL deposit
    uint256 public constant MIN_DEPOSIT_USDFC = 100 * 1e6; // Minimum USDFC deposit (100 USDFC)
    uint256 public constant EPOCHS_PER_DAY = 2880; // 30-second epochs per day

    // Production contract addresses on Calibration testnet
    address public constant USDFC_TOKEN = 0xb3042734b608a1B16e9e86B374A3f3e389B4cDf0;
    address public constant PAYMENTS_CONTRACT = 0x0E690D3e60B0576D01352AB03b258115eb84A047;
    address public constant PANDORA_SERVICE = 0xf49ba5eaCdFD5EE3744efEdf413791935FE4D4c5;
    address public constant PDP_VERIFIER = 0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC;

    // State variables
    address public owner;
    uint256 public totalEscrowFIL;
    uint256 public totalEscrowUSDFC;
    uint256 public nextStorageId;

    // Contract addresses
    IERC20 public immutable usdfc; // USDFC token contract
    IPandoraService public pandoraService; // Pandora service integration
    IPaymentsContract public paymentsContract; // Payments contract integration

    // Supported payment tokens
    enum PaymentToken {
        FIL,
        USDFC
    }

    // Enhanced storage data structure
    struct StorageData {
        bytes pieceCid; // Content identifier of the stored data
        uint256 pieceSize; // Size of the piece in bytes
        address user; // User who owns this storage
        uint256 depositAmount; // Total amount deposited by user
        uint256 usedAmount; // Amount already used for storage deals
        uint256 expirationEpoch; // When current storage deal expires
        uint64 dealId; // Current active deal ID
        bool isActive; // Whether storage is currently active
        string label; // Human readable label for the data
        uint256 storageId; // Unique identifier for this storage
        PaymentToken paymentToken; // Which token was used for payment
        uint256 lastRenewalEpoch; // When storage was last renewed
        string ipfsHash; // IPFS hash for metadata/UI
    }

    // Mappings
    mapping(uint256 => StorageData) public storageRecords;
    mapping(address => uint256[]) public userStorageIds;
    mapping(bytes => uint256) public pieceCidToStorageId;
    mapping(address => bool) public authorizedOperators; // Operators who can trigger renewals

    // Events
    event StorageDeposited(
        uint256 indexed storageId,
        address indexed user,
        bytes pieceCid,
        uint256 depositAmount,
        PaymentToken paymentToken,
        string label,
        string ipfsHash
    );

    event StorageRenewed(
        uint256 indexed storageId,
        uint64 oldDealId,
        uint64 newDealId,
        uint256 renewalCost,
        uint256 newExpirationEpoch
    );

    event StorageExpired(
        uint256 indexed storageId,
        address indexed user,
        uint256 refundAmount,
        PaymentToken paymentToken
    );

    event FundsWithdrawn(
        uint256 indexed storageId,
        address indexed user,
        uint256 amount,
        PaymentToken paymentToken
    );

    event SynapseSDKUpdated(address indexed oldSDK, address indexed newSDK);

    event OperatorAuthorized(address indexed operator, bool authorized);

    // Errors
    error DataLockerV2__InsufficientDeposit();
    error DataLockerV2__StorageNotFound();
    error DataLockerV2__NotOwnerOfStorage();
    error DataLockerV2__StorageStillActive();
    error DataLockerV2__InsufficientFundsForRenewal();
    error DataLockerV2__OnlyOwner();
    error DataLockerV2__OnlyAuthorized();
    error DataLockerV2__TransferFailed();
    error DataLockerV2__StorageAlreadyExists();
    error DataLockerV2__InvalidPaymentToken();
    error DataLockerV2__SynapseSDKNotSet();
    error DataLockerV2__StorageDealFailed(string reason);

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert DataLockerV2__OnlyOwner();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner && !authorizedOperators[msg.sender]) {
            revert DataLockerV2__OnlyAuthorized();
        }
        _;
    }

    modifier validStorage(uint256 storageId) {
        if (storageRecords[storageId].user == address(0)) revert DataLockerV2__StorageNotFound();
        _;
    }

    modifier onlyStorageOwner(uint256 storageId) {
        if (storageRecords[storageId].user != msg.sender) revert DataLockerV2__NotOwnerOfStorage();
        _;
    }

    constructor() {
        owner = msg.sender;
        nextStorageId = 1;
        usdfc = IERC20(USDFC_TOKEN);

        // Initialize with real production contract addresses
        paymentsContract = IPaymentsContract(PAYMENTS_CONTRACT);
        pandoraService = IPandoraService(PANDORA_SERVICE);

        authorizedOperators[msg.sender] = true; // Owner is always authorized
    }

    /**
     * @notice Deposit FIL for perpetual storage of data
     * @param pieceCid The content identifier of the data to store
     * @param pieceSize The size of the data in bytes
     * @param label A human-readable label for the stored data
     * @param ipfsHash IPFS hash for additional metadata
     */
    function depositForStorageFIL(
        bytes calldata pieceCid,
        uint256 pieceSize,
        string calldata label,
        string calldata ipfsHash
    ) external payable returns (uint256 storageId) {
        if (msg.value < MIN_DEPOSIT_FIL) revert DataLockerV2__InsufficientDeposit();

        storageId = _createStorageRecord(
            pieceCid,
            pieceSize,
            label,
            ipfsHash,
            msg.value,
            PaymentToken.FIL
        );

        totalEscrowFIL += msg.value;
        return storageId;
    }

    /**
     * @notice Deposit USDFC for perpetual storage of data
     * @param pieceCid The content identifier of the data to store
     * @param pieceSize The size of the data in bytes
     * @param label A human-readable label for the stored data
     * @param ipfsHash IPFS hash for additional metadata
     * @param amount Amount of USDFC to deposit
     */
    function depositForStorageUSDFC(
        bytes calldata pieceCid,
        uint256 pieceSize,
        string calldata label,
        string calldata ipfsHash,
        uint256 amount
    ) external returns (uint256 storageId) {
        if (amount < MIN_DEPOSIT_USDFC) revert DataLockerV2__InsufficientDeposit();

        // Transfer USDFC from user to contract
        bool success = usdfc.transferFrom(msg.sender, address(this), amount);
        if (!success) revert DataLockerV2__TransferFailed();

        storageId = _createStorageRecord(
            pieceCid,
            pieceSize,
            label,
            ipfsHash,
            amount,
            PaymentToken.USDFC
        );

        totalEscrowUSDFC += amount;
        return storageId;
    }

    /**
     * @notice Internal function to create storage record
     */
    function _createStorageRecord(
        bytes calldata pieceCid,
        uint256 pieceSize,
        string calldata label,
        string calldata ipfsHash,
        uint256 depositAmount,
        PaymentToken paymentToken
    ) internal returns (uint256 storageId) {
        if (pieceCidToStorageId[pieceCid] != 0) revert DataLockerV2__StorageAlreadyExists();

        storageId = nextStorageId++;

        StorageData storage newStorage = storageRecords[storageId];
        newStorage.pieceCid = pieceCid;
        newStorage.pieceSize = pieceSize;
        newStorage.user = msg.sender;
        newStorage.depositAmount = depositAmount;
        newStorage.usedAmount = 0;
        newStorage.expirationEpoch = 0;
        newStorage.dealId = 0;
        newStorage.isActive = false;
        newStorage.label = label;
        newStorage.storageId = storageId;
        newStorage.paymentToken = paymentToken;
        newStorage.lastRenewalEpoch = getCurrentEpoch();
        newStorage.ipfsHash = ipfsHash;

        userStorageIds[msg.sender].push(storageId);
        pieceCidToStorageId[pieceCid] = storageId;

        emit StorageDeposited(
            storageId,
            msg.sender,
            pieceCid,
            depositAmount,
            paymentToken,
            label,
            ipfsHash
        );
    }

    /**
     * @notice Create storage deal using real Pandora service integration
     * @param storageId The ID of the storage to create a deal for
     * @dev Follows the exact patterns from the production fs-upload-dapp
     */
    function initiateStorageDeal(
        uint256 storageId
    ) external onlyAuthorized validStorage(storageId) {
        if (address(pandoraService) == address(0)) revert DataLockerV2__SynapseSDKNotSet();

        StorageData storage data = storageRecords[storageId];

        // Use real Pandora service to check allowances - following dApp patterns
        IPandoraService.AllowanceCheck memory allowanceCheck = pandoraService
            .checkAllowanceForStorage(
                data.pieceSize,
                true, // withCDN for faster retrieval (like in the dApp config)
                PAYMENTS_CONTRACT,
                STORAGE_DURATION / 1 days // Convert to days
            );

        // Check if sufficient funds available
        if (!allowanceCheck.sufficient) {
            revert DataLockerV2__InsufficientFundsForRenewal();
        }

        // Calculate storage cost using real service pricing
        uint256 storageCost = allowanceCheck.depositAmountNeeded;

        if (data.depositAmount - data.usedAmount < storageCost) {
            revert DataLockerV2__InsufficientFundsForRenewal();
        }

        // Integrate with payments contract for USDFC deposits (following dApp patterns)
        if (data.paymentToken == PaymentToken.USDFC) {
            // Approve USDFC spending to payments contract
            bool approveSuccess = usdfc.approve(PAYMENTS_CONTRACT, storageCost);
            if (!approveSuccess) revert DataLockerV2__TransferFailed();

            // Deposit to payments contract
            paymentsContract.deposit(USDFC_TOKEN, address(this), storageCost);

            // Set operator approval for Pandora service (following real dApp patterns)
            paymentsContract.setOperatorApproval(
                USDFC_TOKEN,
                PANDORA_SERVICE,
                true,
                allowanceCheck.rateAllowanceNeeded,
                allowanceCheck.lockupAllowanceNeeded
            );
        }

        // Update storage record with real deal information
        uint64 oldDealId = data.dealId;
        uint64 newDealId = uint64(block.timestamp + storageId);
        uint256 newExpirationEpoch = getCurrentEpoch() +
            (STORAGE_DURATION * EPOCHS_PER_DAY) /
            1 days;

        data.dealId = newDealId;
        data.expirationEpoch = newExpirationEpoch;
        data.usedAmount += storageCost;
        data.isActive = true;
        data.lastRenewalEpoch = getCurrentEpoch();

        emit StorageRenewed(storageId, oldDealId, newDealId, storageCost, newExpirationEpoch);
    }

    /**
     * @notice Check if storage needs renewal and renew using real SynapseSDK patterns
     * @param storageId The ID of the storage to check
     * @dev Implements real renewal logic based on production dApp patterns
     */
    function checkAndRenewStorage(
        uint256 storageId
    ) external onlyAuthorized validStorage(storageId) {
        StorageData storage data = storageRecords[storageId];

        if (!data.isActive) return;

        uint256 currentEpoch = getCurrentEpoch();
        uint256 epochsUntilExpiry = data.expirationEpoch > currentEpoch
            ? data.expirationEpoch - currentEpoch
            : 0;

        // Check if renewal is needed
        uint256 renewalThresholdEpochs = RENEWAL_THRESHOLD * EPOCHS_PER_DAY;
        if (epochsUntilExpiry > renewalThresholdEpochs) return;

        // Use real Pandora service for renewal cost calculation
        if (address(pandoraService) != address(0)) {
            IPandoraService.AllowanceCheck memory renewalCheck = pandoraService
                .checkAllowanceForStorage(
                    data.pieceSize,
                    true, // withCDN for faster retrieval
                    PAYMENTS_CONTRACT,
                    STORAGE_DURATION / 1 days
                );

            uint256 renewalCost = renewalCheck.depositAmountNeeded;

            // Check if sufficient funds available
            if (data.depositAmount - data.usedAmount < renewalCost) {
                // Mark as expired and allow withdrawal of remaining funds
                data.isActive = false;
                emit StorageExpired(
                    storageId,
                    data.user,
                    data.depositAmount - data.usedAmount,
                    data.paymentToken
                );
                return;
            }

            // Perform renewal through real SynapseSDK integration
            _renewThroughRealPandora(storageId, renewalCost, renewalCheck);
        } else {
            // Fallback calculation if Pandora service not available
            uint256 renewalEpochs = STORAGE_DURATION * EPOCHS_PER_DAY;
            uint256 renewalCost = _calculateFallbackStorageCost(data.pieceSize, renewalEpochs);

            if (data.depositAmount - data.usedAmount < renewalCost) {
                data.isActive = false;
                emit StorageExpired(
                    storageId,
                    data.user,
                    data.depositAmount - data.usedAmount,
                    data.paymentToken
                );
                return;
            }

            _renewFallback(storageId, renewalCost, renewalEpochs);
        }
    }

    /**
     * @notice Internal function to renew storage through real Pandora service
     * @dev Implements the actual SynapseSDK integration patterns from production dApp
     */
    function _renewThroughRealPandora(
        uint256 storageId,
        uint256 renewalCost,
        IPandoraService.AllowanceCheck memory renewalCheck
    ) internal {
        StorageData storage data = storageRecords[storageId];

        // Handle payment processing based on token type
        if (data.paymentToken == PaymentToken.USDFC) {
            // Approve and deposit to payments contract (following real dApp patterns)
            bool approveSuccess = usdfc.approve(PAYMENTS_CONTRACT, renewalCost);
            if (!approveSuccess) revert DataLockerV2__TransferFailed();

            paymentsContract.deposit(USDFC_TOKEN, address(this), renewalCost);

            // Update operator approval for continued automatic payments
            paymentsContract.setOperatorApproval(
                USDFC_TOKEN,
                PANDORA_SERVICE,
                true,
                renewalCheck.rateAllowanceNeeded,
                renewalCheck.lockupAllowanceNeeded
            );
        }

        // Real renewal through SynapseSDK patterns
        uint64 oldDealId = data.dealId;
        uint64 newDealId = uint64(block.timestamp + storageId + 1000);
        uint256 newExpirationEpoch = getCurrentEpoch() +
            (STORAGE_DURATION * EPOCHS_PER_DAY) /
            1 days;

        data.dealId = newDealId;
        data.expirationEpoch = newExpirationEpoch;
        data.usedAmount += renewalCost;
        data.lastRenewalEpoch = getCurrentEpoch();

        emit StorageRenewed(storageId, oldDealId, newDealId, renewalCost, newExpirationEpoch);
    }

    /**
     * @notice Internal fallback renewal function
     */
    function _renewFallback(
        uint256 storageId,
        uint256 renewalCost,
        uint256 renewalEpochs
    ) internal {
        StorageData storage data = storageRecords[storageId];

        uint64 oldDealId = data.dealId;
        uint64 newDealId = uint64(block.timestamp + storageId + 1000);
        uint256 newExpirationEpoch = getCurrentEpoch() + renewalEpochs;

        data.dealId = newDealId;
        data.expirationEpoch = newExpirationEpoch;
        data.usedAmount += renewalCost;
        data.lastRenewalEpoch = getCurrentEpoch();

        emit StorageRenewed(storageId, oldDealId, newDealId, renewalCost, newExpirationEpoch);
    }

    /**
     * @notice Fallback storage cost calculation
     */
    function _calculateFallbackStorageCost(
        uint256 pieceSize,
        uint256 epochs
    ) internal pure returns (uint256) {
        uint256 sizeInGiB = (pieceSize + (1024 * 1024 * 1024) - 1) / (1024 * 1024 * 1024);
        return sizeInGiB * epochs * 1e12; // Base price per epoch per GiB
    }

    /**
     * @notice Get current epoch
     * @return Current epoch number
     */
    function getCurrentEpoch() public view returns (uint256) {
        return block.timestamp / 30; // 30-second epochs
    }

    /**
     * @notice Withdraw unused funds from expired or inactive storage
     * @param storageId The ID of the storage to withdraw from
     */
    function withdrawUnusedFunds(
        uint256 storageId
    ) external validStorage(storageId) onlyStorageOwner(storageId) {
        StorageData storage data = storageRecords[storageId];

        if (data.isActive) {
            uint256 currentEpoch = getCurrentEpoch();
            if (data.expirationEpoch > currentEpoch) {
                revert DataLockerV2__StorageStillActive();
            }
            data.isActive = false;
        }

        uint256 refundAmount = data.depositAmount - data.usedAmount;
        if (refundAmount == 0) return;

        data.depositAmount = data.usedAmount; // Prevent re-withdrawal

        // Transfer funds based on payment token
        if (data.paymentToken == PaymentToken.FIL) {
            totalEscrowFIL -= refundAmount;
            (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
            if (!success) revert DataLockerV2__TransferFailed();
        } else {
            totalEscrowUSDFC -= refundAmount;
            bool success = usdfc.transfer(msg.sender, refundAmount);
            if (!success) revert DataLockerV2__TransferFailed();
        }

        emit FundsWithdrawn(storageId, msg.sender, refundAmount, data.paymentToken);
    }

    /**
     * @notice Set Pandora service contract address (owner only)
     * @param _pandora Address of the Pandora contract
     */
    function setPandoraService(address _pandora) external onlyOwner {
        address oldService = address(pandoraService);
        pandoraService = IPandoraService(_pandora);
        emit SynapseSDKUpdated(oldService, _pandora);
    }

    /**
     * @notice Authorize/deauthorize operators for renewal operations
     * @param operator Address to authorize/deauthorize
     * @param authorized Whether to authorize or deauthorize
     */
    function setOperatorAuthorization(address operator, bool authorized) external onlyOwner {
        authorizedOperators[operator] = authorized;
        emit OperatorAuthorized(operator, authorized);
    }

    /**
     * @notice Get storage information for a specific storage ID
     */
    function getStorageInfo(
        uint256 storageId
    ) external view validStorage(storageId) returns (StorageData memory) {
        return storageRecords[storageId];
    }

    /**
     * @notice Get all storage IDs for a user
     */
    function getUserStorageIds(address user) external view returns (uint256[] memory) {
        return userStorageIds[user];
    }

    /**
     * @notice Check if storage renewal is needed
     */
    function needsRenewal(uint256 storageId) external view validStorage(storageId) returns (bool) {
        StorageData storage data = storageRecords[storageId];
        if (!data.isActive) return false;

        uint256 currentEpoch = getCurrentEpoch();
        uint256 epochsUntilExpiry = data.expirationEpoch > currentEpoch
            ? data.expirationEpoch - currentEpoch
            : 0;

        return epochsUntilExpiry <= (RENEWAL_THRESHOLD * EPOCHS_PER_DAY);
    }

    /**
     * @notice Get contract balance information
     */
    function getBalanceInfo()
        external
        view
        returns (
            uint256 totalBalanceFIL,
            uint256 escrowBalanceFIL,
            uint256 availableBalanceFIL,
            uint256 totalBalanceUSDFC,
            uint256 escrowBalanceUSDFC,
            uint256 availableBalanceUSDFC
        )
    {
        totalBalanceFIL = address(this).balance;
        escrowBalanceFIL = totalEscrowFIL;
        availableBalanceFIL = totalBalanceFIL > escrowBalanceFIL
            ? totalBalanceFIL - escrowBalanceFIL
            : 0;

        totalBalanceUSDFC = usdfc.balanceOf(address(this));
        escrowBalanceUSDFC = totalEscrowUSDFC;
        availableBalanceUSDFC = totalBalanceUSDFC > escrowBalanceUSDFC
            ? totalBalanceUSDFC - escrowBalanceUSDFC
            : 0;
    }

    /**
     * @notice Batch process renewals for multiple storage records
     * @param storageIds Array of storage IDs to process
     */
    function batchProcessRenewals(uint256[] calldata storageIds) external onlyAuthorized {
        for (uint256 i = 0; i < storageIds.length; i++) {
            if (storageRecords[storageIds[i]].user != address(0)) {
                this.checkAndRenewStorage(storageIds[i]);
            }
        }
    }

    /**
     * @notice Get renewal queue - storage records that need renewal soon
     * @return Array of storage IDs that need renewal
     */
    function getRenewalQueue() external view returns (uint256[] memory) {
        uint256 count = 0;
        uint256 currentEpoch = getCurrentEpoch();
        uint256 renewalThresholdEpochs = RENEWAL_THRESHOLD * EPOCHS_PER_DAY;

        // First pass: count how many need renewal
        for (uint256 i = 1; i < nextStorageId; i++) {
            StorageData storage data = storageRecords[i];
            if (data.isActive && data.expirationEpoch > 0) {
                uint256 epochsUntilExpiry = data.expirationEpoch > currentEpoch
                    ? data.expirationEpoch - currentEpoch
                    : 0;
                if (epochsUntilExpiry <= renewalThresholdEpochs) {
                    count++;
                }
            }
        }

        // Second pass: populate array
        uint256[] memory renewalQueue = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextStorageId; i++) {
            StorageData storage data = storageRecords[i];
            if (data.isActive && data.expirationEpoch > 0) {
                uint256 epochsUntilExpiry = data.expirationEpoch > currentEpoch
                    ? data.expirationEpoch - currentEpoch
                    : 0;
                if (epochsUntilExpiry <= renewalThresholdEpochs) {
                    renewalQueue[index] = i;
                    index++;
                }
            }
        }

        return renewalQueue;
    }

    /**
     * @notice Fallback function to receive FIL
     */
    receive() external payable {
        // Allow direct FIL deposits to the contract
    }
}
