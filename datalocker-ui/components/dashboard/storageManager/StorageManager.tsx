"use client";

import { useAccount } from "wagmi";
import { useBalances } from "@/hooks/useBalances";
import { usePayment } from "@/hooks/usePayment";
import { motion, Variants } from "framer-motion";
import { StorageBalanceHeader } from "./StorageBalanceHeader";
import { WalletBalancesSection } from "./WalletBalancesSection";
import { StorageStatusSection } from "./StorageStatusSection";
import { AllowanceStatusSection } from "./AllowanceStatusSection";
import { ActionSection } from "./ActionSection";
import { StatusMessage } from "./StatusMessage";


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

/**
 * Component to display and manage token payments for storage
 */
export const StorageManager = () => {
  const { isConnected } = useAccount();
  const {
    data,
    isLoading: isBalanceLoading,
    refetch: refetchBalances,
    error,
  } = useBalances();
  const balances = data;
  const { mutation: paymentMutation, status } = usePayment();
  const { mutateAsync: handlePayment, isPending: isProcessingPayment } =
    paymentMutation;

  const handleRefetchBalances = async () => {
    await refetchBalances();
  };

  console.log(error);

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
      <StorageBalanceHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WalletBalancesSection
            balances={balances}
            isLoading={isBalanceLoading}
          />
          <StorageStatusSection
            balances={balances}
            isLoading={isBalanceLoading}
          />
        </div>
        
        <div className="space-y-6">
          <AllowanceStatusSection
            balances={balances}
            isLoading={isBalanceLoading}
          />
          <ActionSection
            balances={balances}
            isLoading={isBalanceLoading}
            isProcessingPayment={isProcessingPayment}
            onPayment={handlePayment}
            handleRefetchBalances={handleRefetchBalances}
          />
        </div>
      </div>

      <StatusMessage status={status} />
    </motion.div>
  );
};