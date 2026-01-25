import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

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

  // Parse content into lines for better formatting
  const parseContent = () => {
    const lines = content.split('\n');
    return lines.filter(line => line.trim());
  };

  const lines = parseContent();

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
      <div className="space-y-2">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          
          // Bullet points
          if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
            return (
              <div key={i} className="flex items-start gap-3 pl-4">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <FormattedText content={trimmed.replace(/^[\*\-]\s*/, '')} />
                </p>
              </div>
            );
          }
          
          return (
            <p key={i} className="section-content">
              <FormattedText content={trimmed} />
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
