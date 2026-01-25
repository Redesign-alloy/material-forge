import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface DiagnosticCardProps {
  content: string;
  index: number;
}

export function DiagnosticCard({ content, index }: DiagnosticCardProps) {
  // Parse content into structured sections
  const parseContent = () => {
    const lines = content.split('\n');
    const sections: { type: 'header' | 'subheader' | 'bullet' | 'text'; content: string }[] = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Check for numbered headers (1. **Header:**)
      const numberedHeader = trimmed.match(/^(\d+)\.\s*\*?\*?([^*]+)\*?\*?:?\s*$/);
      if (numberedHeader) {
        sections.push({ type: 'header', content: `${numberedHeader[1]}. ${numberedHeader[2].trim()}` });
        return;
      }
      
      // Check for sub-bullets with **bold**
      if (trimmed.startsWith('*')) {
        sections.push({ type: 'bullet', content: trimmed.replace(/^\*\s*/, '') });
        return;
      }
      
      sections.push({ type: 'text', content: trimmed });
    });
    
    return sections;
  };
  
  const sections = parseContent();
  
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
      <div className="space-y-3">
        {sections.map((section, i) => {
          if (section.type === 'header') {
            return (
              <h4 key={i} className="text-base font-semibold text-foreground mt-4 first:mt-0">
                <FormattedText content={section.content} />
              </h4>
            );
          }
          
          if (section.type === 'bullet') {
            return (
              <div key={i} className="flex items-start gap-3 pl-4">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <FormattedText content={section.content} />
                </p>
              </div>
            );
          }
          
          return (
            <p key={i} className="section-content">
              <FormattedText content={section.content} />
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
