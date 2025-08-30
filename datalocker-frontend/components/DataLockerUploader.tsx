"use client";
import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { useDataLocker, PaymentToken } from "@/hooks/useDataLocker";
import { DATALOCKER_CONFIG } from "@/config";
import { useConfetti } from "@/hooks/useConfetti";

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
    <div className="mt-4 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Upload to DataLocker</h2>
          <p className="text-secondary">
            Secure perpetual storage for your files on Filecoin
          </p>
        </div>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : file
              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
              : "border-gray-300 hover:border-primary hover:bg-secondary/50"
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {file ? (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                ✓ File Selected
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">{file.name}</p>
                <p>Size: {formatStorageSize(file.size.toString())}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-6xl">📁</div>
              <div className="text-lg font-semibold">
                Drop your file here or click to browse
              </div>
              <div className="text-sm text-gray-500">
                Any file type supported
              </div>
            </div>
          )}
        </div>

        {/* File Details Form */}
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 border rounded-lg p-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Storage Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter a label for this storage"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isUploading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Token
                </label>
                <select
                  value={paymentToken}
                  onChange={(e) => setPaymentToken(e.target.value as PaymentToken)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isUploading}
                >
                  <option value="USDFC">USDFC (Recommended)</option>
                  <option value="FIL">FIL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deposit Amount ({paymentToken})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Min: ${getMinAmount()}`}
                  min={getMinAmount()}
                  step={paymentToken === "FIL" ? "0.1" : "1"}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                💡 Storage Details
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Storage Duration: {DATALOCKER_CONFIG.STORAGE_DURATION} days (6 months)</li>
                <li>• Auto-renewal when {DATALOCKER_CONFIG.RENEWAL_THRESHOLD} days remain</li>
                <li>• Unused funds can be withdrawn after expiration</li>
                <li>• Files are stored permanently on Filecoin network</li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpload}
              disabled={isUploading || !amount || !label || parseFloat(amount) < parseFloat(getMinAmount())}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating Storage...</span>
                </div>
              ) : (
                `Deposit ${amount} ${paymentToken} for Perpetual Storage`
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Upload Status */}
        {(depositFIL.error || depositUSDFC.error) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="text-red-800 dark:text-red-200">
              <strong>Upload Failed:</strong>{" "}
              {depositFIL.error?.message || depositUSDFC.error?.message}
            </div>
          </motion.div>
        )}

        {(depositFIL.isSuccess || depositUSDFC.isSuccess) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
          >
            <div className="text-green-800 dark:text-green-200">
              <strong>🎉 Storage Created!</strong> Your file has been deposited for perpetual storage on Filecoin.
              Check the "My Storage" tab to monitor your storage records.
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
