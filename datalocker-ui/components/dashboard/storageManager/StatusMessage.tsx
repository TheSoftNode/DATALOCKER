import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon 
} from "@heroicons/react/24/outline";

interface StatusMessageProps {
  status: string | null;
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
 * Component for displaying status messages
 */
export const StatusMessage = ({ status }: StatusMessageProps) => {
  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      variants={itemVariants}
    >
      <Card className={`border-2 ${
        status.includes("❌")
          ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50"
          : status.includes("✅")
          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50"
          : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50"
      }`}>
        <CardContent className="p-4">
          <div className={`flex items-center gap-3 ${
            status.includes("❌") ? "text-red-800 dark:text-red-200" :
            status.includes("✅") ? "text-green-800 dark:text-green-200" :
            "text-blue-800 dark:text-blue-200"
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              status.includes("❌") ? "bg-red-500" :
              status.includes("✅") ? "bg-green-500" : "bg-blue-500"
            }`}>
              {status.includes("❌") ? <XCircleIcon className="w-4 h-4 text-white" /> :
               status.includes("✅") ? <CheckCircleIcon className="w-4 h-4 text-white" /> :
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                 <ArrowPathIcon className="w-4 h-4 text-white" />
               </motion.div>}
            </div>
            <span className="font-medium">{status}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};