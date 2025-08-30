// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "../interfaces/ISynapseSDK.sol";

/**
 * @title StorageCalculator
 * @notice Utility contract for storage cost calculations based on real SynapseSDK patterns
 * @dev Implements the exact calculation methods found in the production fs-upload-dApp
 * @author DataLocker Team - Following SynapseSDK production patterns
 */
library StorageCalculator {
    // Constants from SynapseSDK and real dApp configuration
    uint256 public constant SIZE_CONSTANTS_GiB = 1024 * 1024 * 1024; // 1 GiB in bytes
    uint256 public constant SIZE_CONSTANTS_TiB = 1024 * 1024 * 1024 * 1024; // 1 TiB in bytes
    uint256 public constant TIME_CONSTANTS_EPOCHS_PER_DAY = 2880; // 30-second epochs
    uint256 public constant TIME_CONSTANTS_EPOCHS_PER_MONTH = 86400; // ~30 days worth of epochs

    // Production dApp configuration values
    uint256 public constant DEFAULT_STORAGE_CAPACITY_GB = 10; // From dApp config
    uint256 public constant DEFAULT_PERSISTENCE_PERIOD_DAYS = 30; // From dApp config
    uint256 public constant DEFAULT_MIN_DAYS_THRESHOLD = 10; // From dApp config
    bool public constant DEFAULT_WITH_CDN = true; // From dApp config

    /**
     * @notice Calculate storage capacity in GB supported by a given rate allowance
     * @param rateAllowance The current rate allowance (bigint)
     * @param storageCosts The storage cost object from Pandora service
     * @return storageCapacityGB The number of GB that can be supported
     * @dev Follows exact logic from calculateRateAllowanceGB in the dApp
     */
    function calculateRateAllowanceGB(
        uint256 rateAllowance,
        IPandoraService.StorageCosts memory storageCosts
    ) internal pure returns (uint256 storageCapacityGB) {
        // Calculate the total monthly rate allowance
        uint256 monthlyRate = rateAllowance * TIME_CONSTANTS_EPOCHS_PER_MONTH;

        // Get price per TiB per month based on CDN usage
        uint256 pricePerTBPerMonth = DEFAULT_WITH_CDN
            ? storageCosts.pricePerTiBPerMonthWithCDN
            : storageCosts.pricePerTiBPerMonthNoCDN;

        // Calculate how many bytes can be stored for that rate
        uint256 bytesThatCanBeStored = (monthlyRate * SIZE_CONSTANTS_TiB) / pricePerTBPerMonth;

        // Convert bytes to GB
        return bytesThatCanBeStored / SIZE_CONSTANTS_GiB;
    }

    /**
     * @notice Calculate current storage usage based on rate usage and capacity
     * @param allowanceCheck The Pandora balance data
     * @param storageCapacityBytes The storage capacity in bytes
     * @return currentStorageBytes Current storage used in bytes
     * @return currentStorageGB Current storage used in GB
     * @dev Follows exact logic from calculateCurrentStorageUsage in the dApp
     */
    function calculateCurrentStorageUsage(
        IPandoraService.AllowanceCheck memory allowanceCheck,
        uint256 storageCapacityBytes
    ) internal pure returns (uint256 currentStorageBytes, uint256 currentStorageGB) {
        currentStorageBytes = 0;
        currentStorageGB = 0;

        if (allowanceCheck.currentRateUsed > 0 && allowanceCheck.rateAllowanceNeeded > 0) {
            // Proportionally calculate storage usage based on rate used
            currentStorageBytes =
                (allowanceCheck.currentRateUsed * storageCapacityBytes) /
                allowanceCheck.rateAllowanceNeeded;

            // Convert bytes to GB
            currentStorageGB = currentStorageBytes / SIZE_CONSTANTS_GiB;
        }
    }

    /**
     * @notice Calculate storage metrics following exact dApp patterns
     * @param allowanceCheck The allowance check result from Pandora
     * @param persistencePeriodDays The desired persistence period
     * @param storageCapacityBytes The storage capacity in bytes
     * @param minDaysThreshold Minimum days threshold for warnings
     * @return metrics Complete storage calculation result
     * @dev Implements calculateStorageMetrics logic from the production dApp
     */
    function calculateStorageMetrics(
        IPandoraService.AllowanceCheck memory allowanceCheck,
        uint256 persistencePeriodDays,
        uint256 storageCapacityBytes,
        uint256 minDaysThreshold
    ) internal pure returns (StorageMetrics memory metrics) {
        // Calculate the rate needed per epoch for the requested storage
        uint256 rateNeeded = allowanceCheck.costs.perEpoch;

        // Calculate daily lockup requirements at requested and current rates
        uint256 lockupPerDay = TIME_CONSTANTS_EPOCHS_PER_DAY * rateNeeded;
        uint256 lockupPerDayAtCurrentRate = TIME_CONSTANTS_EPOCHS_PER_DAY *
            allowanceCheck.currentRateUsed;

        // Calculate remaining lockup and persistence days
        uint256 currentLockupRemaining = allowanceCheck.currentLockupAllowance >
            allowanceCheck.currentLockupUsed
            ? allowanceCheck.currentLockupAllowance - allowanceCheck.currentLockupUsed
            : 0;

        // How many days of storage remain at requested rate
        uint256 persistenceDaysLeft = lockupPerDay > 0 ? currentLockupRemaining / lockupPerDay : 0;

        // How many days of storage remain at current rate usage
        uint256 persistenceDaysLeftAtCurrentRate = lockupPerDayAtCurrentRate > 0
            ? currentLockupRemaining / lockupPerDayAtCurrentRate
            : (currentLockupRemaining > 0 ? type(uint256).max : 0);

        // Calculate current storage usage
        (uint256 currentStorageBytes, uint256 currentStorageGB) = calculateCurrentStorageUsage(
            allowanceCheck,
            storageCapacityBytes
        );

        // Determine sufficiency of allowances
        bool isRateSufficient = allowanceCheck.currentRateAllowance >= rateNeeded;
        bool isLockupSufficient = persistenceDaysLeft >= minDaysThreshold;
        bool isSufficient = isRateSufficient && isLockupSufficient;

        // Calculate how much storage (in GB) the current rate allowance supports
        uint256 currentRateAllowanceGB = calculateRateAllowanceGB(
            allowanceCheck.currentRateAllowance,
            allowanceCheck.costs
        );

        return
            StorageMetrics({
                rateNeeded: rateNeeded,
                rateUsed: allowanceCheck.currentRateUsed,
                currentStorageBytes: currentStorageBytes,
                currentStorageGB: currentStorageGB,
                totalLockupNeeded: allowanceCheck.lockupAllowanceNeeded,
                depositNeeded: allowanceCheck.depositAmountNeeded,
                persistenceDaysLeft: persistenceDaysLeft,
                persistenceDaysLeftAtCurrentRate: persistenceDaysLeftAtCurrentRate,
                isRateSufficient: isRateSufficient,
                isLockupSufficient: isLockupSufficient,
                isSufficient: isSufficient,
                currentRateAllowanceGB: currentRateAllowanceGB,
                currentLockupAllowance: allowanceCheck.currentLockupAllowance
            });
    }

    /**
     * @notice Check allowances including dataset creation fee
     * @param allowanceCheck The base allowance check from Pandora
     * @param minDaysThreshold Minimum days threshold for sufficiency
     * @param includeDataSetCreationFee Whether to include dataset creation fee
     * @return result Enhanced allowance check with dataset creation considerations
     * @dev Follows exact logic from checkAllowances in the production dApp
     */
    function checkAllowancesWithDatasetFee(
        IPandoraService.AllowanceCheck memory allowanceCheck,
        uint256 minDaysThreshold,
        bool includeDataSetCreationFee
    ) internal pure returns (AllowanceCheckResult memory result) {
        // Dataset creation fee: 0.1 USDFC in wei (from dApp constants)
        uint256 dataSetCreationFee = includeDataSetCreationFee
            ? 100000000000000000 // 0.1 * 10^18
            : 0;

        // Use available properties for lockup and deposit
        uint256 totalLockupNeeded = allowanceCheck.lockupAllowanceNeeded;
        uint256 depositNeeded = allowanceCheck.depositAmountNeeded;

        // Use the greater of current or needed rate allowance
        uint256 rateAllowanceNeeded = allowanceCheck.currentRateAllowance >
            allowanceCheck.rateAllowanceNeeded
            ? allowanceCheck.currentRateAllowance
            : allowanceCheck.rateAllowanceNeeded;

        // Add dataset creation fee to lockup and deposit if needed
        uint256 lockupAllowanceNeeded = totalLockupNeeded + dataSetCreationFee;
        uint256 depositAmountNeeded = depositNeeded + dataSetCreationFee;

        // Calculate daily lockup requirements
        uint256 lockupPerDay = TIME_CONSTANTS_EPOCHS_PER_DAY * allowanceCheck.costs.perEpoch;

        // Calculate remaining lockup and persistence days
        uint256 currentLockupRemaining = allowanceCheck.currentLockupAllowance >
            allowanceCheck.currentLockupUsed
            ? allowanceCheck.currentLockupAllowance - allowanceCheck.currentLockupUsed
            : 0;

        // Check if lockup balance is sufficient for dataset creation
        bool isLockupBalanceSufficientForDataSetCreation = currentLockupRemaining >=
            lockupAllowanceNeeded;

        // Calculate persistence days left
        uint256 persistenceDaysLeft = lockupPerDay > 0 ? currentLockupRemaining / lockupPerDay : 0;

        // Determine sufficiency of allowances
        bool isRateSufficient = allowanceCheck.currentRateAllowance >= rateAllowanceNeeded;
        bool isLockupSufficient = persistenceDaysLeft >= minDaysThreshold &&
            isLockupBalanceSufficientForDataSetCreation;
        bool isSufficient = isRateSufficient && isLockupSufficient;

        return
            AllowanceCheckResult({
                isSufficient: isSufficient,
                isLockupSufficient: isLockupSufficient,
                isRateSufficient: isRateSufficient,
                rateAllowanceNeeded: rateAllowanceNeeded,
                lockupAllowanceNeeded: lockupAllowanceNeeded,
                depositAmountNeeded: depositAmountNeeded,
                currentLockupRemaining: currentLockupRemaining,
                lockupPerDay: lockupPerDay,
                persistenceDaysLeft: persistenceDaysLeft
            });
    }

    // Struct definitions based on dApp types
    struct StorageMetrics {
        uint256 rateNeeded;
        uint256 rateUsed;
        uint256 currentStorageBytes;
        uint256 currentStorageGB;
        uint256 totalLockupNeeded;
        uint256 depositNeeded;
        uint256 persistenceDaysLeft;
        uint256 persistenceDaysLeftAtCurrentRate;
        bool isRateSufficient;
        bool isLockupSufficient;
        bool isSufficient;
        uint256 currentRateAllowanceGB;
        uint256 currentLockupAllowance;
    }

    struct AllowanceCheckResult {
        bool isSufficient;
        bool isLockupSufficient;
        bool isRateSufficient;
        uint256 rateAllowanceNeeded;
        uint256 lockupAllowanceNeeded;
        uint256 depositAmountNeeded;
        uint256 currentLockupRemaining;
        uint256 lockupPerDay;
        uint256 persistenceDaysLeft;
    }
}
