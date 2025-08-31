import { useAccount } from "wagmi";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartBarIcon } from "@heroicons/react/24/outline";

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

/**
 * Header section with title and USDFC faucet button
 */
export const StorageBalanceHeader = () => {
  const { chainId } = useAccount();

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={floatingAnimation}
                className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <ChartBarIcon className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Storage Balance Manager
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Manage your USDFC deposits for Filecoin storage
                </CardDescription>
              </div>
            </div>
            
            {chainId === 314159 && (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {
                      window.open(
                        "https://forest-explorer.chainsafe.dev/faucet/calibnet_usdfc",
                        "_blank"
                      );
                    }}
                    className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white shadow-lg"
                    size="sm"
                  >
                    Get tUSDFC
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {
                      window.open(
                        "https://faucet.calibnet.chainsafe-fil.io/funds.html",
                        "_blank"
                      );
                    }}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 hover:border-teal-500 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400"
                    size="sm"
                  >
                    Get tFIL
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
};