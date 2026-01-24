import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface RootCauseCardProps {
  content: string;
  index: number;
}

export function RootCauseCard({ content, index }: RootCauseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card"
    >
      <div className="section-title">
        <Search className="w-5 h-5 text-glow-blue" />
        <span>Root Cause Analysis</span>
      </div>
      <div className="section-content whitespace-pre-wrap">
        {content}
      </div>
    </motion.div>
  );
}
