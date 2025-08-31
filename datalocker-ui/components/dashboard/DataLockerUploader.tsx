"use client";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { motion, Variants } from "framer-motion";
import { useDataLocker, PaymentToken } from "@/hooks/useDataLocker";
import { useConfetti } from "@/hooks/useConfetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CloudArrowUpIcon, DocumentIcon, CurrencyDollarIcon, ClockIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { DATALOCKER_CONFIG } from "@/config";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
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

const dropZoneVariants: Variants = {
  idle: { scale: 1, opacity: 1 },
  dragOver: { 
    scale: 1.02, 
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  fileSelected: { 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const DataLockerUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [label, setLabel] = useState("");
  const [paymentToken, setPaymentToken] = useState<PaymentToken>("USDFC");
  const [amount, setAmount] = useState("");
  const { isConnected } = useAccount();
  const { triggerConfetti } = useConfetti();

  const {
    depositFIL,
    depositUSDFC,
    formatStorageSize,
  } = useDataLocker();

  const isUploading = depositFIL.isPending || depositUSDFC.isPending;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setLabel(files[0].name);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLabel(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file || !amount || !label) return;

    const ipfsHash = `QmDataLocker${Date.now()}`; // Simple placeholder

    try {
      if (paymentToken === "FIL") {
        await depositFIL.mutateAsync({
          file,
          label,
          ipfsHash,
          filAmount: amount,
        });
      } else {
        await depositUSDFC.mutateAsync({
          file,
          label,
          ipfsHash,
          usdfcAmount: amount,
        });
      }

      // Reset form
      setFile(null);
      setLabel("");
      setAmount("");
      triggerConfetti();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const getMinAmount = () => {
    return paymentToken === "FIL" 
      ? DATALOCKER_CONFIG.MIN_DEPOSIT_FIL.toString()
      : DATALOCKER_CONFIG.MIN_DEPOSIT_USDFC.toString();
  };

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={floatingAnimation}
                className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <CloudArrowUpIcon className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Upload to DataLocker
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Secure perpetual storage for your files on the Filecoin network
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* File Drop Zone */}
      <motion.div variants={itemVariants}>
        <motion.div
          variants={dropZoneVariants}
          animate={isDragging ? "dragOver" : file ? "fileSelected" : "idle"}
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-teal-500 bg-teal-50 dark:bg-teal-950/50 shadow-lg"
              : file
              ? "border-green-500 bg-green-50 dark:bg-green-950/50 shadow-md"
              : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30"
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {file ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <DocumentIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                File Selected Successfully
              </div>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <p className="font-medium text-lg">{file.name}</p>
                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700">
                  Size: {formatStorageSize(file.size.toString())}
                </Badge>
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={floatingAnimation}
              className="space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <CloudArrowUpIcon className="w-10 h-10 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-2">
                <div className="text-xl font-semibold text-slate-900 dark:text-white">
                  Drop your file here or click to browse
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Any file type supported • Drag & drop or click to select
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* File Details Form */}
      {file && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          variants={itemVariants}
        >
          <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CurrencyDollarIcon className="w-5 h-5 text-teal-500" />
                Storage Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Storage Label */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Storage Label
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Enter a descriptive label for this storage"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  disabled={isUploading}
                />
              </div>

              {/* Payment Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Payment Token
                  </label>
                  <select
                    value={paymentToken}
                    onChange={(e) => setPaymentToken(e.target.value as PaymentToken)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    disabled={isUploading}
                  >
                    <option value="USDFC">USDFC (Recommended)</option>
                    <option value="FIL">FIL</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Deposit Amount ({paymentToken})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Minimum: ${getMinAmount()}`}
                    min={getMinAmount()}
                    step={paymentToken === "FIL" ? "0.1" : "1"}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Storage Information */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-blue-800 dark:text-blue-200">
                    Storage Details
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <ClockIcon className="w-4 h-4" />
                    <span>Duration: {DATALOCKER_CONFIG.STORAGE_DURATION} days (6 months)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    <span>Auto-renewal when {DATALOCKER_CONFIG.RENEWAL_THRESHOLD} days remain</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Unused funds withdrawable after expiration</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <CloudArrowUpIcon className="w-4 h-4" />
                    <span>Permanent Filecoin network storage</span>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !amount || !label || parseFloat(amount) < parseFloat(getMinAmount())}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                  size="lg"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Creating Storage...</span>
                    </div>
                  ) : (
                    `Deposit ${amount || "0"} ${paymentToken} for Perpetual Storage`
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Status Messages */}
      {(depositFIL.error || depositUSDFC.error) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          variants={itemVariants}
        >
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <strong>Upload Failed:</strong>{" "}
                  {depositFIL.error?.message || depositUSDFC.error?.message}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {(depositFIL.isSuccess || depositUSDFC.isSuccess) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          variants={itemVariants}
        >
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-green-800 dark:text-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
                <div>
                  <div className="font-bold text-lg">Storage Created Successfully!</div>
                  <div className="text-sm">
                    Your file has been deposited for perpetual storage on Filecoin.
                    Check the "My Storage" tab to monitor your storage records.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};