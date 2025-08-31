import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { config } from "@/config";
import { formatUnits } from "viem";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SectionProps } from "@/types";
import { AllowanceItem } from "./AllowanceItem";

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
 * Section displaying allowance status
 */
export const AllowanceStatusSection = ({ balances, isLoading }: SectionProps) => {
  const depositNeededFormatted = Number(
    formatUnits(balances?.depositNeeded ?? BigInt(0), 18)
  ).toFixed(3);

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheckIcon className="w-5 h-5 text-teal-500" />
            Allowance Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <AllowanceItem
              label="Rate Allowance"
              isSufficient={balances?.isRateSufficient}
              isLoading={isLoading}
            />
            
            {!isLoading && !balances?.isRateSufficient && (
              <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        ⚠️ Max configured storage is {config.storageCapacity} GB. Your current covered storage is {balances?.currentRateAllowanceGB?.toLocaleString()} GB.
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You are currently using {balances?.currentStorageGB?.toLocaleString()} GB.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <AllowanceItem
              label="Lockup Allowance"
              isSufficient={balances?.isLockupSufficient}
              isLoading={isLoading}
            />

            {!isLoading && !balances?.isLockupSufficient && (
              <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        ⚠️ Max configured lockup is {config.persistencePeriod} days. Your current covered lockup is {balances?.persistenceDaysLeft.toFixed(1)} days. Which is less than the notice period of {config.minDaysThreshold} days.
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        You are currently using {balances?.currentStorageGB?.toLocaleString()} GB. Please deposit {depositNeededFormatted} USDFC to extend your lockup for {(config.persistencePeriod - (balances?.persistenceDaysLeft ?? 0)).toFixed(1)} more days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};