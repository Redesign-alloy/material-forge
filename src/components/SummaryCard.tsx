import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface SummaryCardProps {
  content: string;
  index: number;
}

export function SummaryCard({ content, index }: SummaryCardProps) {
  // Remove markdown headers for cleaner display
  const cleanContent = content.replace(/^#+\s*/gm, '').trim();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card bg-gradient-to-br from-card to-primary/5 border-primary/20"
    >
      <div className="section-title">
        <Sparkles className="w-5 h-5 text-primary" />
        <span>Analysis Summary</span>
      </div>
      <div className="text-sm text-foreground font-medium">
        <FormattedText content={cleanContent} />
      </div>
    </motion.div>
  );
}
