import { motion } from "framer-motion";
import { FileText } from "lucide-react";

interface GenericResultCardProps {
  title: string;
  content: string;
  index: number;
}

export function GenericResultCard({ title, content, index }: GenericResultCardProps) {
  // Format the title from snake_case or camelCase to Title Case
  const formatTitle = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card"
    >
      <div className="section-title">
        <FileText className="w-5 h-5 text-muted-foreground" />
        <span>{formatTitle(title)}</span>
      </div>
      <div className="section-content whitespace-pre-wrap">
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </div>
    </motion.div>
  );
}
