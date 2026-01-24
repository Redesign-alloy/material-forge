import { motion } from "framer-motion";
import { TrendingUp, DollarSign } from "lucide-react";

interface ProfitabilityCardProps {
  content: string;
  index: number;
}

export function ProfitabilityCard({ content, index }: ProfitabilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card border-l-4 border-success"
    >
      <div className="section-title">
        <DollarSign className="w-5 h-5 text-success" />
        <span>Economic Impact Analysis</span>
      </div>
      <div className="section-content whitespace-pre-wrap">
        {content}
      </div>
      <div className="mt-4 flex items-center gap-2 text-success text-sm font-medium">
        <TrendingUp className="w-4 h-4" />
        <span>Cost-benefit optimized solution</span>
      </div>
    </motion.div>
  );
}
