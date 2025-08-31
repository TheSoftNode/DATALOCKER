"use client";
import { useAccount } from "wagmi";
import { useState } from "react";
import { DataLockerUploader } from "./DataLockerUploader";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Confetti from "@/components/ui/Confetti";
import { useConfetti } from "@/hooks/useConfetti";
import { MyStorageRecords } from "./MyStorageRecords";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalances } from "@/hooks/useBalances";
import Github from "@/components/ui/icons/Github";
import Filecoin from "@/components/ui/icons/Filecoin";
import { ArrowLeftIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { ThemeToggle } from "../shared/ThemeToggle";
import { StorageManager } from "./storageManager/StorageManager";
import { DataLockerLogo } from "../shared/Logo";
import { Footer } from "../layout/Footer";

type Tab = "manage-storage" | "upload" | "my-storage";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const tabVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: 0.2,
    }
  },
};

export default function Dashboard() {
  const { isConnected, chainId } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("manage-storage");
  const { showConfetti } = useConfetti();
  const { data: balances, isLoading: isLoadingBalances } = useBalances();
  const router = useRouter();

  const isCalibrationNetwork = chainId === 314159;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/30 dark:border-slate-700/30 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/')}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                  title="Back to Landing"
                >
                  <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </motion.div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <DataLockerLogo 
                  size="md" 
                  variant="default" 
                  animated={true}
                  clickable={false}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <ThemeToggle />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <ConnectButton />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col py-6 sm:py-8 px-4 sm:px-6 w-full mx-auto max-w-7xl"
      >
        {/* Dashboard Header */}
        <motion.div
          variants={itemVariants}
          className="mb-6 sm:mb-8"
        >
          <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
                <DataLockerLogo 
                  size="lg" 
                  variant="icon-only" 
                  animated={true}
                  clickable={false}
                />
                <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  DataLocker Dashboard
                </CardTitle>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-blue-800 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-full"
                  >
                    <a
                      href="https://github.com/yourusername/datalocker"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github />
                    </a>
                  </Button>
                </motion.div>
              </div>

              <CardDescription className="text-base sm:text-lg text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap px-4">
                <span>Perpetual storage on Filecoin with</span>
                <a
                  href="https://docs.secured.finance/usdfc-stablecoin/getting-started"
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 hover:underline font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  USDFC
                </a>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <span>Your balance:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800 font-semibold">
                    {isLoadingBalances || !isConnected
                      ? "..."
                      : `$${balances?.usdfcBalanceFormatted.toFixed(1)}`}
                  </Badge>
                </div>
              </CardDescription>

              {!isCalibrationNetwork && isConnected && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4"
                >
                  <Badge variant="destructive" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800 px-3 py-2">
                    ⚠️ Please switch to Filecoin Calibration network
                  </Badge>
                </motion.div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isConnected ? (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex justify-center"
            >
              <Card className="max-w-md w-full mx-4 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center">
                  <motion.div
                    animate={floatingAnimation}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <DataLockerLogo 
                      size="xl" 
                      variant="icon-only" 
                      animated={true}
                      clickable={false}
                    />
                  </motion.div>
                  <CardTitle className="text-xl sm:text-2xl text-slate-900 dark:text-white mb-2">
                    Connect Your Wallet
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Connect your wallet to access DataLocker's secure storage features
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ConnectButton />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={itemVariants}
              className="w-full"
            >
              {/* Enhanced Tab Navigation */}
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-1.5 mb-6 sm:mb-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { key: "manage-storage", label: "Manage Storage", icon: "⚙️" },
                    { key: "upload", label: "Upload File", icon: "📁" },
                    { key: "my-storage", label: "My Storage", icon: "💾" }
                  ].map((tab) => (
                    <motion.button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as Tab)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 px-3 sm:px-6 text-center rounded-xl font-medium transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                        activeTab === tab.key
                          ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="text-base sm:hidden">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "manage-storage" ? (
                  <motion.div
                    key="manage-storage"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <StorageManager />
                  </motion.div>
                ) : activeTab === "upload" ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <DataLockerUploader />
                  </motion.div>
                ) : (
                  activeTab === "my-storage" && (
                    <motion.div
                      key="my-storage"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <MyStorageRecords />
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Footer */}
      <Footer />
    </div>
  );
}