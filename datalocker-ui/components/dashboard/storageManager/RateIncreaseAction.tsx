import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentActionProps } from "@/types";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

/**
 * Component for handling rate deposit action
 */
export const RateIncreaseAction = ({
  currentLockupAllowance,
  rateNeeded,
  isProcessingPayment,
  onPayment,
  handleRefetchBalances,
}: PaymentActionProps) => {
  if (!currentLockupAllowance || !rateNeeded) return null;

  return (
    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Increase your rate allowance to meet your storage needs.
            </p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={async () => {
              await onPayment({
                lockupAllowance: currentLockupAllowance,
                epochRateAllowance: rateNeeded,
                depositAmount: BigInt(0),
              });
              await handleRefetchBalances();
            }}
            disabled={isProcessingPayment}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg disabled:opacity-50"
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
                <span>Increasing Rate...</span>
              </div>
            ) : (
              "Increase Rate"
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};