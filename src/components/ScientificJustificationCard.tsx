import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

interface ScientificJustificationCardProps {
  content: string;
  index: number;
}

export function ScientificJustificationCard({ content, index }: ScientificJustificationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card"
    >
      <div className="section-title">
        <FlaskConical className="w-5 h-5 text-glow-blue" />
        <span>Technical Deep-Dive</span>
      </div>
      <div className="whitepaper-text whitespace-pre-wrap max-h-[400px] overflow-y-auto pr-2">
        {content}
      </div>
    </motion.div>
  );
}
