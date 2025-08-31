import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudIcon, ClockIcon } from "@heroicons/react/24/outline";
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
 * Section displaying storage status
 */
export const StorageStatusSection = ({ balances, isLoading }: SectionProps) => (
  <motion.div variants={itemVariants}>
    <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CloudIcon className="w-5 h-5 text-teal-500" />
          Storage Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/30 dark:to-teal-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Storage Usage</span>
            <span className="font-bold text-blue-900 dark:text-blue-100">
              {isLoading ? (
                <div className="w-24 h-4 bg-blue-200 dark:bg-blue-700 rounded animate-pulse" />
              ) : (
                `${balances?.currentStorageGB?.toLocaleString()} GB / ${balances?.currentRateAllowanceGB?.toLocaleString()} GB`
              )}
            </span>
          </div>
          {!isLoading && balances && (
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((balances.currentStorageGB / balances.currentRateAllowanceGB) * 100, 100)}%` 
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Persistence days left at max usage (max rate: {balances?.currentRateAllowanceGB?.toLocaleString()} GB)
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {isLoading ? (
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              ) : (
                `${balances?.persistenceDaysLeft.toFixed(1)} days`
              )}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Persistence days left at current usage (current rate: {balances?.currentStorageGB?.toLocaleString()} GB)
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {isLoading ? (
                <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              ) : (
                `${balances?.persistenceDaysLeftAtCurrentRate.toFixed(1)} days`
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);