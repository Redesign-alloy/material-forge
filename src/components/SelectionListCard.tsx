import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2 } from "lucide-react";

interface SelectionListCardProps {
  content: string;
  index: number;
}

export function SelectionListCard({ content, index }: SelectionListCardProps) {
  // Parse the content to extract material recommendations
  const lines = content.split('\n').filter(line => line.trim());
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card border-l-4 border-primary"
    >
      <div className="section-title">
        <Lightbulb className="w-5 h-5 text-primary" />
        <span>Recommended Engineering Solutions</span>
      </div>
      <div className="space-y-3">
        {lines.map((line, i) => {
          // Check if this line contains a material recommendation (starts with number)
          const isMainRecommendation = /^\d+\./.test(line.trim());
          const isBulletPoint = line.trim().startsWith('*');
          
          if (isMainRecommendation) {
            return (
              <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-foreground">{line.replace(/^\d+\.\s*/, '')}</p>
              </div>
            );
          }
          
          if (isBulletPoint) {
            return (
              <p key={i} className="text-sm text-muted-foreground pl-8">
                {line.replace(/^\*\s*/, '• ')}
              </p>
            );
          }
          
          return (
            <p key={i} className="section-content">{line}</p>
          );
        })}
      </div>
    </motion.div>
  );
}
