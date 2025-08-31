import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface InsufficientFundsCardProps {
  filBalance: bigint;
  usdfcBalance: bigint;
}

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
 * Component for displaying insufficient funds warning
 */
export const InsufficientFundsCard = ({ filBalance, usdfcBalance }: InsufficientFundsCardProps) => {
  return (
    <motion.div variants={itemVariants}>
      <div className="space-y-4">
        {filBalance === BigInt(0) && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ⚠️ You need to FIL tokens to pay for transaction fees. Please deposit FIL tokens to your wallet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {usdfcBalance === BigInt(0) && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ⚠️ You need to USDFC tokens to pay for storage. Please deposit USDFC tokens to your wallet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};