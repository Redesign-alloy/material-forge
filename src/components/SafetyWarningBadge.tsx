import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

interface SafetyWarningBadgeProps {
  message: string;
}

export function SafetyWarningBadge({ message }: SafetyWarningBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 bg-warning/10 border border-warning/30 rounded-xl"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-warning/20 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="font-semibold text-warning text-sm">Physical Constraint Alert</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
