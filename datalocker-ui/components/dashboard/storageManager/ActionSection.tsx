import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/config";
import { 
  CheckCircleIcon, 
} from "@heroicons/react/24/outline";
import { PaymentActionProps } from "@/types";
import { InsufficientFundsCard } from "./InsufficientFundsCard";
import { LockupIncreaseAction } from "./LockupIncreaseAction";
import { RateIncreaseAction } from "./RateIncreaseAction";
import { CompleteCombinedAction } from "./CompleteCombinedAction";

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

/**
 * Section for payment actions
 */
export const ActionSection = ({
  balances,
  isLoading,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  // Debug logging to see what values we're getting
  console.log("ActionSection Debug:", {
    isLoading,
    balances,
    filBalance: balances?.filBalance?.toString(),
    usdfcBalance: balances?.usdfcBalance?.toString(),
    isSufficient: balances?.isSufficient,
    isRateSufficient: balances?.isRateSufficient,
    isLockupSufficient: balances?.isLockupSufficient,
    totalLockupNeeded: balances?.totalLockupNeeded?.toString(),
    depositNeeded: balances?.depositNeeded?.toString(),
    rateNeeded: balances?.rateNeeded?.toString(),
  });

  if (isLoading || !balances) {
    return (
      <motion.div variants={itemVariants}>
        <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 mx-auto mb-4 border-2 border-teal-500 border-t-transparent rounded-full"
            />
            <p className="text-slate-600 dark:text-slate-400">Loading balance information...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (balances.isSufficient) {
    return (
      <motion.div variants={itemVariants}>
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  ✅ Your storage balance is sufficient for {config.storageCapacity}GB of storage for {balances.persistenceDaysLeft.toFixed(1)} days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (balances.filBalance === BigInt(0) && balances.usdfcBalance === BigInt(0)) {
    return (
      <InsufficientFundsCard 
        filBalance={balances.filBalance}
        usdfcBalance={balances.usdfcBalance}
      />
    );
  }

  return (
    <motion.div variants={itemVariants}>
      <div className="space-y-4">
        {balances.isRateSufficient && !balances.isLockupSufficient && (
          <LockupIncreaseAction
            totalLockupNeeded={balances.totalLockupNeeded}
            depositNeeded={balances.depositNeeded}
            rateNeeded={balances.rateNeeded}
            isProcessingPayment={isProcessingPayment}
            onPayment={onPayment}
            handleRefetchBalances={handleRefetchBalances}
          />
        )}
        {!balances.isRateSufficient && balances.isLockupSufficient && (
          <RateIncreaseAction
            currentLockupAllowance={balances.currentLockupAllowance}
            rateNeeded={balances.rateNeeded}
            isProcessingPayment={isProcessingPayment}
            onPayment={onPayment}
            handleRefetchBalances={handleRefetchBalances}
          />
        )}
        {!balances.isRateSufficient && !balances.isLockupSufficient && (
          <CompleteCombinedAction
            balances={balances}
            isProcessingPayment={isProcessingPayment}
            onPayment={onPayment}
            handleRefetchBalances={handleRefetchBalances}
          />
        )}
      </div>
    </motion.div>
  );
};