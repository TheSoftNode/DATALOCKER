import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentActionProps } from "@/types";
import { formatUnits } from "viem";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

/**
 * Component for handling complete combined action (both rate and lockup insufficient)
 */
export const CompleteCombinedAction = ({
  balances,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  console.log("CompleteCombinedAction Debug:", {
    balances,
    totalLockupNeeded: balances?.totalLockupNeeded?.toString(),
    depositNeeded: balances?.depositNeeded?.toString(), 
    rateNeeded: balances?.rateNeeded?.toString(),
  });

  // Temporarily remove the null check to see what's happening
  // if (!totalLockupNeeded || !depositNeeded || !rateNeeded) return null;

  const depositNeededFormatted = Number(
    formatUnits(balances?.depositNeeded ?? BigInt(0), 6) // USDFC has 6 decimals
  ).toFixed(3);

  return (
    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-200 mb-2">
              ⚠️ Your storage balance is insufficient. You need to deposit {depositNeededFormatted} USDFC & Increase your rate allowance to meet your storage needs.
            </p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={async () => {
              await onPayment({
                lockupAllowance: balances?.totalLockupNeeded ?? BigInt(0),
                epochRateAllowance: balances?.rateNeeded ?? BigInt(0),
                depositAmount: balances?.depositNeeded ?? BigInt(0),
              });
              await handleRefetchBalances();
            }}
            disabled={isProcessingPayment}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg disabled:opacity-50"
            size="lg"
          >
            {isProcessingPayment ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowPathIcon className="w-4 h-4" />
                </motion.div>
                <span>Processing transactions...</span>
              </div>
            ) : (
              `Deposit ${depositNeededFormatted} USDFC & Increase Allowances`
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};