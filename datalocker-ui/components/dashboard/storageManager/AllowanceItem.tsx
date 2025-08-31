import { Badge } from "@/components/ui/badge";
import { AllowanceItemProps } from "@/types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

/**
 * Component for displaying an allowance status
 */
export const AllowanceItem = ({
  label,
  isSufficient,
  isLoading,
}: AllowanceItemProps) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
    <div className="flex items-center gap-2">
      {isLoading ? (
        <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      ) : (
        <Badge className={`flex items-center gap-1 ${
          isSufficient 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800" 
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800"
        }`}>
          {isSufficient ? (
            <CheckCircleIcon className="w-3 h-3" />
          ) : (
            <XCircleIcon className="w-3 h-3" />
          )}
          {isSufficient ? "Sufficient" : "Insufficient"}
        </Badge>
      )}
    </div>
  </div>
);