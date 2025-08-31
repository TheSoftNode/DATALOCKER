import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  WalletIcon, 
  CurrencyDollarIcon, 
  CloudIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";
import { SectionProps } from "@/types";

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
 * Section displaying wallet balances
 */
export const WalletBalancesSection = ({ balances, isLoading }: SectionProps) => (
  <motion.div variants={itemVariants}>
    <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <WalletIcon className="w-5 h-5 text-teal-500" />
          Wallet Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">FIL Balance</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  `${balances?.filBalanceFormatted?.toLocaleString()} FIL`
                )}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">USDFC Balance</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  `${balances?.usdfcBalanceFormatted?.toLocaleString()} USDFC`
                )}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CloudIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Warm Storage Balance</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  `${balances?.filecoinWarmStorageBalanceFormatted?.toLocaleString()} USDFC`
                )}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rate Allowance</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {isLoading ? (
                  <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  `${balances?.currentRateAllowanceGB?.toLocaleString()} GB`
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);