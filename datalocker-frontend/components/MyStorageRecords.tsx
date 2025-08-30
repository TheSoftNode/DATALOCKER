"use client";
import { motion } from "framer-motion";
import { useDataLocker, StorageRecord } from "@/hooks/useDataLocker";
import { useAccount } from "wagmi";
import { useState } from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Renewal Needed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const StorageRecordCard = ({ record }: { record: StorageRecord }) => {
  const { 
    withdrawFunds, 
    renewStorage, 
    formatStorageSize, 
    formatTimeRemaining, 
    getStorageStatus 
  } = useDataLocker();

  const status = getStorageStatus(record);
  const canWithdraw = !record.isActive || status === "Expired";
  const needsRenewal = status === "Renewal Needed";

  const handleWithdraw = async () => {
    try {
      await withdrawFunds.mutateAsync(record.storageId);
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  const handleRenew = async () => {
    try {
      await renewStorage.mutateAsync(record.storageId);
    } catch (error) {
      console.error("Renewal failed:", error);
    }
  };

  const usedPercentage = (parseFloat(record.usedAmount) / parseFloat(record.depositAmount)) * 100;
  const remainingFunds = parseFloat(record.depositAmount) - parseFloat(record.usedAmount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold truncate">{record.label}</h3>
          <p className="text-sm text-gray-500">Storage ID: {record.storageId}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">File Size</p>
          <p className="font-medium">{formatStorageSize(record.pieceSize)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment Token</p>
          <p className="font-medium">{record.paymentToken}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Deposited</p>
          <p className="font-medium">
            {record.paymentToken === "FIL" 
              ? `${(parseFloat(record.depositAmount) / 1e18).toFixed(2)} FIL`
              : `${(parseFloat(record.depositAmount) / 1e6).toFixed(2)} USDFC`
            }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Remaining</p>
          <p className="font-medium text-green-600">
            {record.paymentToken === "FIL" 
              ? `${(remainingFunds / 1e18).toFixed(2)} FIL`
              : `${(remainingFunds / 1e6).toFixed(2)} USDFC`
            }
          </p>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Funds Used</span>
          <span>{usedPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          />
        </div>
      </div>

      {record.isActive && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Time Remaining</p>
          <p className="font-medium">{formatTimeRemaining(record.expirationEpoch)}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {needsRenewal && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRenew}
            disabled={renewStorage.isPending}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {renewStorage.isPending ? "Renewing..." : "Renew Storage"}
          </motion.button>
        )}

        {canWithdraw && remainingFunds > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWithdraw}
            disabled={withdrawFunds.isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {withdrawFunds.isPending ? "Withdrawing..." : "Withdraw Funds"}
          </motion.button>
        )}

        {record.isActive && !needsRenewal && (
          <div className="flex-1 bg-gray-100 text-gray-500 py-2 px-4 rounded-lg text-center">
            Storage Active
          </div>
        )}
      </div>

      {/* IPFS Hash */}
      {record.ipfsHash && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">IPFS: {record.ipfsHash}</p>
        </div>
      )}
    </motion.div>
  );
};

export const MyStorageRecords = () => {
  const { isConnected } = useAccount();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const {
    userStorageRecords,
    isLoadingRecords,
    recordsError,
    contractBalance,
    renewalQueue,
    getStorageStatus,
  } = useDataLocker();

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please connect your wallet to view storage records</p>
      </div>
    );
  }

  if (isLoadingRecords) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (recordsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading storage records: {recordsError.message}</p>
      </div>
    );
  }

  const filteredRecords = userStorageRecords?.filter(record => {
    if (filterStatus === "all") return true;
    return getStorageStatus(record).toLowerCase() === filterStatus.toLowerCase();
  }) || [];

  const activeRecords = userStorageRecords?.filter(r => r.isActive) || [];
  const renewalNeeded = userStorageRecords?.filter(r => getStorageStatus(r) === "Renewal Needed") || [];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Storage</h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {userStorageRecords?.length || 0}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Active</h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {activeRecords.length}
          </p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Need Renewal</h3>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {renewalNeeded.length}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Contract Balance</h3>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
            {contractBalance?.totalBalanceUSDFC} USDFC
          </p>
          <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
            {contractBalance?.totalBalanceFIL} FIL
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Storage</option>
          <option value="active">Active</option>
          <option value="renewal needed">Renewal Needed</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Storage Records */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">No Storage Records</h3>
          <p className="text-gray-500">
            {filterStatus === "all" 
              ? "Upload your first file to create a storage record"
              : `No storage records with status: ${filterStatus}`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <StorageRecordCard key={record.storageId} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};
