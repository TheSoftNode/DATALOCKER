"use client";
import { motion, Variants } from "framer-motion";
import { useDataLocker, StorageRecord } from "@/hooks/useDataLocker";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DocumentIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  CloudIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Active":
        return {
          className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
          icon: <CheckCircleIcon className="w-3 h-3" />
        };
      case "Renewal Needed":
        return {
          className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
          icon: <ExclamationTriangleIcon className="w-3 h-3" />
        };
      case "Expired":
        return {
          className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
          icon: <XCircleIcon className="w-3 h-3" />
        };
      case "Inactive":
        return {
          className: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200 dark:border-slate-800",
          icon: <ClockIcon className="w-3 h-3" />
        };
      default:
        return {
          className: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400 border-slate-200 dark:border-slate-800",
          icon: <ClockIcon className="w-3 h-3" />
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`flex items-center gap-1 px-3 py-1 text-xs font-medium border ${config.className}`}>
      {config.icon}
      {status}
    </Badge>
  );
};

// const StorageRecordCard = ({ record }: { record: StorageRecord }) => {
//   const { 
//     withdrawFunds, 
//     renewStorage, 
//     formatStorageSize, 
//     formatTimeRemaining, 
//     getStorageStatus 
//   } = useDataLocker();

//   const status = getStorageStatus(record);
//   const canWithdraw = !record.isActive || status === "Expired";
//   const needsRenewal = status === "Renewal Needed";

//   const handleWithdraw = async () => {
//     try {
//       await withdrawFunds.mutateAsync(record.storageId);
//     } catch (error) {
//       console.error("Withdrawal failed:", error);
//     }
//   };

//   const handleRenew = async () => {
//     try {
//       await renewStorage.mutateAsync(record.storageId);
//     } catch (error) {
//       console.error("Renewal failed:", error);
//     }
//   };

//   const usedPercentage = (parseFloat(record.usedAmount) / parseFloat(record.depositAmount)) * 100;
//   const remainingFunds = parseFloat(record.depositAmount) - parseFloat(record.usedAmount);

//   return (
//     <motion.div
//       variants={cardVariants}
//       whileHover={{ 
//         scale: 1.02, 
//         boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" 
//       }}
//       className="group"
//     >
//       <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-teal-300 dark:hover:border-teal-600">
//         <CardHeader className="pb-3">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
//                 <DocumentIcon className="w-5 h-5 text-white" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <CardTitle className="text-lg font-semibold truncate text-slate-900 dark:text-white">
//                   {record.label}
//                 </CardTitle>
//                 <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-mono">
//                   ID: {record.storageId}
//                 </CardDescription>
//               </div>
//             </div>
//             <StatusBadge status={status} />
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Key Metrics Grid */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1">
//               <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
//                 <CloudIcon className="w-3 h-3" />
//                 <span>File Size</span>
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-white">
//                 {formatStorageSize(record.pieceSize)}
//               </p>
//             </div>
//             <div className="space-y-1">
//               <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
//                 <CurrencyDollarIcon className="w-3 h-3" />
//                 <span>Token</span>
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-white">
//                 {record.paymentToken}
//               </p>
//             </div>
//             <div className="space-y-1">
//               <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
//                 <BanknotesIcon className="w-3 h-3" />
//                 <span>Deposited</span>
//               </div>
//               <p className="font-semibold text-slate-900 dark:text-white">
//                 {record.paymentToken === "FIL" 
//                   ? `${(parseFloat(record.depositAmount) / 1e18).toFixed(2)} FIL`
//                   : `${(parseFloat(record.depositAmount) / 1e6).toFixed(2)} USDFC`
//                 }
//               </p>
//             </div>
//             <div className="space-y-1">
//               <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
//                 <ChartBarIcon className="w-3 h-3" />
//                 <span>Remaining</span>
//               </div>
//               <p className="font-semibold text-green-600 dark:text-green-400">
//                 {record.paymentToken === "FIL" 
//                   ? `${(remainingFunds / 1e18).toFixed(2)} FIL`
//                   : `${(remainingFunds / 1e6).toFixed(2)} USDFC`
//                 }
//               </p>
//             </div>
//           </div>

//           {/* Usage Progress Bar */}
//           <div className="space-y-2">
//             <div className="flex justify-between items-center text-sm">
//               <span className="text-slate-600 dark:text-slate-400">Funds Usage</span>
//               <span className="font-semibold text-slate-900 dark:text-white">
//                 {usedPercentage.toFixed(1)}%
//               </span>
//             </div>
//             <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
//               <motion.div 
//                 initial={{ width: 0 }}
//                 animate={{ width: `${Math.min(usedPercentage, 100)}%` }}
//                 transition={{ duration: 1, ease: "easeOut" }}
//                 className={`h-2.5 rounded-full transition-all duration-300 ${
//                   usedPercentage < 50 ? 'bg-green-500' :
//                   usedPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
//                 }`}
//               />
//             </div>
//           </div>

//           {/* Time Remaining */}
//           {record.isActive && (
//             <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
//               <div className="flex items-center gap-2 text-sm">
//                 <ClockIcon className="w-4 h-4 text-slate-500" />
//                 <span className="text-slate-600 dark:text-slate-400">Time Remaining:</span>
//                 <span className="font-semibold text-slate-900 dark:text-white">
//                   {formatTimeRemaining(record.expirationEpoch)}
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 pt-2">
//             {needsRenewal && (
//               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                 <Button
//                   onClick={handleRenew}
//                   disabled={renewStorage.isPending}
//                   className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
//                   size="sm"
//                 >
//                   {renewStorage.isPending ? (
//                     <div className="flex items-center gap-2">
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                       >
//                         <ArrowPathIcon className="w-4 h-4" />
//                       </motion.div>
//                       <span>Renewing...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <ArrowPathIcon className="w-4 h-4" />
//                       <span>Renew</span>
//                     </div>
//                   )}
//                 </Button>
//               </motion.div>
//             )}

//             {canWithdraw && remainingFunds > 0 && (
//               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
//                 <Button
//                   onClick={handleWithdraw}
//                   disabled={withdrawFunds.isPending}
//                   className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
//                   size="sm"
//                 >
//                   {withdrawFunds.isPending ? (
//                     <div className="flex items-center gap-2">
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                       >
//                         <BanknotesIcon className="w-4 h-4" />
//                       </motion.div>
//                       <span>Withdrawing...</span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-2">
//                       <BanknotesIcon className="w-4 h-4" />
//                       <span>Withdraw</span>
//                     </div>
//                   )}
//                 </Button>
//               </motion.div>
//             )}

//             {record.isActive && !needsRenewal && (
//               <div className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-2 px-4 rounded-lg text-center text-sm font-medium flex items-center justify-center gap-2">
//                 <CheckCircleIcon className="w-4 h-4 text-green-500" />
//                 Storage Active
//               </div>
//             )}
//           </div>

//           {/* IPFS Hash */}
//           {record.ipfsHash && (
//             <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
//               <div className="flex items-center gap-2 text-xs">
//                 <span className="text-slate-500 dark:text-slate-400">IPFS:</span>
//                 <code className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs truncate">
//                   {record.ipfsHash}
//                 </code>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };

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
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" 
      }}
      className="group h-full"
    >
      <Card className="border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-teal-300 dark:hover:border-teal-600 h-full flex flex-col">
        {/* Compact Header */}
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-3 xs:gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg font-semibold truncate text-slate-900 dark:text-white leading-tight">
                  {record.label}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  ID: {record.storageId}
                </CardDescription>
              </div>
            </div>
            <div className="flex-shrink-0 xs:self-start">
              <StatusBadge status={status} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 flex-1 flex flex-col">
          {/* Responsive Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <CloudIcon className="w-3 h-3" />
                <span className="truncate">File Size</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {formatStorageSize(record.pieceSize)}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <CurrencyDollarIcon className="w-3 h-3" />
                <span className="truncate">Token</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {record.paymentToken}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <BanknotesIcon className="w-3 h-3" />
                <span className="truncate">Deposited</span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                {record.paymentToken === "FIL" 
                  ? `${(parseFloat(record.depositAmount) / 1e18).toFixed(2)} FIL`
                  : `${(parseFloat(record.depositAmount) / 1e6).toFixed(2)} USDFC`
                }
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <ChartBarIcon className="w-3 h-3" />
                <span className="truncate">Remaining</span>
              </div>
              <p className="font-semibold text-green-600 dark:text-green-400 text-sm truncate">
                {record.paymentToken === "FIL" 
                  ? `${(remainingFunds / 1e18).toFixed(2)} FIL`
                  : `${(remainingFunds / 1e6).toFixed(2)} USDFC`
                }
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Funds Usage</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {usedPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usedPercentage, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                  usedPercentage < 50 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                  usedPercentage < 80 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                  'bg-gradient-to-r from-red-400 to-red-500'
                }`}
              />
            </div>
          </div>

          {/* Compact Time Remaining */}
          {record.isActive && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-lg">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                <span className="text-slate-600 dark:text-slate-400">Time Remaining:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatTimeRemaining(record.expirationEpoch)}
                </span>
              </div>
            </div>
          )}

          {/* Responsive Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
            {needsRenewal && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleRenew}
                  disabled={renewStorage.isPending}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                  size="sm"
                >
                  {renewStorage.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.div>
                      <span className="text-xs sm:text-sm">Renewing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Renew</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            )}

            {canWithdraw && remainingFunds > 0 && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleWithdraw}
                  disabled={withdrawFunds.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                  size="sm"
                >
                  {withdrawFunds.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <BanknotesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.div>
                      <span className="text-xs sm:text-sm">Withdrawing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <BanknotesIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">Withdraw</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            )}

            {record.isActive && !needsRenewal && (
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>Storage Active</span>
              </div>
            )}
          </div>

          {/* Compact IPFS Hash */}
          {record.ipfsHash && (
            <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex-shrink-0">IPFS:</span>
                <code className="font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs truncate">
                  {record.ipfsHash}
                </code>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center"
      >
        <Card className="max-w-md border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <DocumentIcon className="w-8 h-8 text-slate-500" />
            </div>
            <CardTitle className="mb-2 text-slate-900 dark:text-white">Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view your storage records
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoadingRecords) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (recordsError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
          <CardContent className="text-center py-8">
            <XCircleIcon className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <CardTitle className="text-red-800 dark:text-red-200 mb-2">Error Loading Records</CardTitle>
            <CardDescription className="text-red-600 dark:text-red-300">
              {recordsError.message}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const filteredRecords = userStorageRecords?.filter(record => {
    if (filterStatus === "all") return true;
    return getStorageStatus(record).toLowerCase() === filterStatus.toLowerCase();
  }) || [];

  const activeRecords = userStorageRecords?.filter(r => r.isActive) || [];
  const renewalNeeded = userStorageRecords?.filter(r => getStorageStatus(r) === "Renewal Needed") || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <DocumentIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Storage</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {userStorageRecords?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Active</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {activeRecords.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Need Renewal</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {renewalNeeded.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <BanknotesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Contract Balance</p>
                  <p className="text-xs font-bold text-purple-900 dark:text-purple-100">
                    {contractBalance?.totalBalanceUSDFC} USDFC
                  </p>
                  <p className="text-xs font-bold text-purple-900 dark:text-purple-100">
                    {contractBalance?.totalBalanceFIL} FIL
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="w-5 h-5 text-slate-500" />
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Filter by Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              >
                <option value="all">All Storage</option>
                <option value="active">Active</option>
                <option value="renewal needed">Renewal Needed</option>
                <option value="expired">Expired</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Storage Records */}
      {filteredRecords.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mx-auto mb-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center"
              >
                <DocumentIcon className="w-10 h-10 text-slate-400" />
              </motion.div>
              <CardTitle className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                No Storage Records Found
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {filterStatus === "all" 
                  ? "Upload your first file to create a storage record"
                  : `No storage records with status: ${filterStatus}`
                }
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <StorageRecordCard key={record.storageId} record={record} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

