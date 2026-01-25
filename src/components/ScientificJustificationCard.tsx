import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface ScientificJustificationCardProps {
  content: string;
  index: number;
}

export function ScientificJustificationCard({ content, index }: ScientificJustificationCardProps) {
  // Parse content into structured sections
  const parseContent = () => {
    const lines = content.split('\n');
    const sections: { type: 'header' | 'subheader' | 'bullet' | 'text'; content: string }[] = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Check for numbered headers (1. **Header:**)
      const numberedHeader = trimmed.match(/^(\d+)\.\s*\*?\*?(.+?)(?:\*?\*?):?\s*$/);
      if (numberedHeader) {
        sections.push({ type: 'header', content: `${numberedHeader[1]}. ${numberedHeader[2].trim()}` });
        return;
      }
      
      // Check for bold sub-headers
      const subheaderMatch = trimmed.match(/^\*?\*?([^*:]+):\*?\*?\s*(.*)/);
      if (subheaderMatch && trimmed.startsWith('*')) {
        const label = subheaderMatch[1].replace(/^\*+/, '').trim();
        const rest = subheaderMatch[2];
        if (rest) {
          sections.push({ type: 'subheader', content: `${label}:` });
          sections.push({ type: 'text', content: rest });
        } else {
          sections.push({ type: 'subheader', content: `${label}:` });
        }
        return;
      }
      
      // Check for sub-bullets
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        sections.push({ type: 'bullet', content: trimmed.replace(/^[\*\-]\s*/, '') });
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
      className="result-card"
    >
      <div className="section-title">
        <BookOpen className="w-5 h-5 text-primary" />
        <span>Technical Deep-Dive</span>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sections.map((section, i) => {
          if (section.type === 'header') {
            return (
              <h4 key={i} className="text-base font-semibold text-foreground mt-4 first:mt-0">
                <FormattedText content={section.content} />
              </h4>
            );
          }
          
          if (section.type === 'subheader') {
            return (
              <h5 key={i} className="text-sm font-medium text-foreground mt-3 pl-4 italic">
                <FormattedText content={section.content} />
              </h5>
            );
          }
          
          if (section.type === 'bullet') {
            return (
              <div key={i} className="flex items-start gap-3 pl-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="whitepaper-text leading-relaxed">
                  <FormattedText content={section.content} />
                </p>
              </div>
            );
          }
          
          return (
            <p key={i} className="whitepaper-text pl-4">
              <FormattedText content={section.content} />
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
