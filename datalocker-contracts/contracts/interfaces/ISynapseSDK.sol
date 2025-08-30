// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title SynapseSDK Production Interface
 * @notice Interface based on real SynapseSDK implementation patterns from fs-upload-dapp
 * @dev Updated to match the actual SynapseSDK API based on production dApp analysis
 */

/**
 * @title IPandoraService
 * @dev Interface for integrating with Pandora (Filecoin Warm Storage Service) from SynapseSDK
 * @notice Based on real implementation from FilOzone/synapse-sdk production usage
 */
interface IPandoraService {
    struct StorageCosts {
        uint256 perEpoch;
        uint256 perDay;
        uint256 perMonth;
        uint256 pricePerTiBPerMonthNoCDN;
        uint256 pricePerTiBPerMonthWithCDN;
    }

    struct AllowanceCheck {
        uint256 rateAllowanceNeeded;
        uint256 lockupAllowanceNeeded;
        uint256 currentRateAllowance;
        uint256 currentLockupAllowance;
        uint256 currentRateUsed;
        uint256 currentLockupUsed;
        bool sufficient;
        string message;
        StorageCosts costs;
        uint256 depositAmountNeeded;
    }

    struct Provider {
        address owner;
        string pdpUrl;
        bool approved;
    }

    struct ProofSetInfo {
        bytes32 railId;
        address payee;
        uint256 currentRootCount;
        bool withCDN;
        uint256 creationEpoch;
    }

    /**
     * @notice Get current storage service pricing
     * @return costs Storage costs structure with all pricing tiers
     */
    function getServicePrice() external view returns (StorageCosts memory costs);

    /**
     * @notice Check if allowances are sufficient for storage
     * @param storageCapacityBytes Storage capacity in bytes
     * @param withCDN Whether to use CDN for faster retrieval
     * @param paymentsContract Address of the payments contract
     * @param persistencePeriodDays How many days the storage should persist
     * @return check Complete allowance check result with all information
     */
    function checkAllowanceForStorage(
        uint256 storageCapacityBytes,
        bool withCDN,
        address paymentsContract,
        uint256 persistencePeriodDays
    ) external view returns (AllowanceCheck memory check);

    /**
     * @notice Get all approved storage providers with details
     * @return providers Array of approved providers with metadata
     */
    function getAllApprovedProviders() external view returns (Provider[] memory providers);

    /**
     * @notice Get client proof sets with full details
     * @param client Client address to get proof sets for
     * @return proofSets Array of proof set information
     */
    function getClientProofSetsWithDetails(
        address client
    ) external view returns (ProofSetInfo[] memory proofSets);

    /**
     * @notice Get provider ID by address
     * @param providerAddress The provider's address
     * @return providerId The provider's ID
     */
    function getProviderIdByAddress(
        address providerAddress
    ) external view returns (uint256 providerId);

    /**
     * @notice Create a new proof set for data storage
     * @param withCDN Whether to enable CDN for this proof set
     * @return railId The unique identifier for the created proof set
     */
    function createProofSet(bool withCDN) external returns (bytes32 railId);

    /**
     * @notice Add a piece to an existing proof set
     * @param railId The proof set identifier
     * @param pieceCid The piece CID to add
     * @param pieceSize The size of the piece in bytes
     */
    function addPiece(bytes32 railId, bytes32 pieceCid, uint256 pieceSize) external;
}

/**
 * @title IPaymentsContract
 * @dev Interface for the Payments contract from SynapseSDK
 * @notice Based on real patterns from the production dApp implementation
 */
interface IPaymentsContract {
    struct AccountInfo {
        uint256 funds;
        uint256 lockupCurrent;
        uint256 lockupRate;
        uint256 lockupLastSettledAt;
    }

    /**
     * @notice Get account information for a token and owner
     * @param token The token address (USDFC)
     * @param owner The account owner
     * @return info Account information
     */
    function accounts(address token, address owner) external view returns (AccountInfo memory info);

    /**
     * @notice Set operator approval for a service
     * @param token The token address
     * @param operator The operator (service) address
     * @param approved Whether to approve or revoke
     * @param rateAllowance Rate allowance per epoch
     * @param lockupAllowance Total lockup allowance
     */
    function setOperatorApproval(
        address token,
        address operator,
        bool approved,
        uint256 rateAllowance,
        uint256 lockupAllowance
    ) external;

    /**
     * @notice Deposit tokens to the payments contract
     * @param token The token address
     * @param to The recipient address
     * @param amount The amount to deposit
     */
    function deposit(address token, address to, uint256 amount) external;

    /**
     * @notice Withdraw tokens from the payments contract
     * @param token The token address
     * @param amount The amount to withdraw
     */
    function withdraw(address token, uint256 amount) external;

    /**
     * @notice Get current balance for a token and user
     * @param token The token address
     * @param user The user address
     * @return balance Current balance
     */
    function balance(address token, address user) external view returns (uint256 balance);

    /**
     * @notice Get wallet balance for native token (FIL)
     * @param user The user address
     * @return balance Native token balance
     */
    function walletBalance(address user) external view returns (uint256 balance);

    /**
     * @notice Get allowance for a service to spend tokens
     * @param token The token address
     * @param owner The owner address
     * @param spender The spender address
     * @return allowance Current allowance
     */
    function allowance(
        address token,
        address owner,
        address spender
    ) external view returns (uint256 allowance);
}

/**
 * @title IPDPVerifier
 * @dev Interface for Proof of Data Possession verification
 * @notice Used to verify ongoing storage proof requirements
 */
interface IPDPVerifier {
    /**
     * @notice Verify a storage proof for a proof set
     * @param railId The proof set identifier
     * @param proof The proof data to verify
     * @return valid Whether the proof is valid
     */
    function verifyProof(bytes32 railId, bytes calldata proof) external view returns (bool valid);

    /**
     * @notice Get proof requirements for a proof set
     * @param railId The proof set identifier
     * @return nextProofEpoch When the next proof is required
     * @return proofInterval How often proofs are required
     */
    function getProofRequirements(
        bytes32 railId
    ) external view returns (uint256 nextProofEpoch, uint256 proofInterval);
}
