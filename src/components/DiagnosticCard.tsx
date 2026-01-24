import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface DiagnosticCardProps {
  content: string;
  index: number;
}

export function DiagnosticCard({ content, index }: DiagnosticCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card border-l-4 border-warning"
    >
      <div className="section-title">
        <AlertCircle className="w-5 h-5 text-warning" />
        <span>Root Cause Diagnostic</span>
      </div>
      <div className="section-content whitespace-pre-wrap">
        {content}
      </div>
    </motion.div>
  );
}
