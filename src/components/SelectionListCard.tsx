import { motion } from "framer-motion";
import { Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface SelectionListCardProps {
  content: string;
  index: number;
}

export function SelectionListCard({ content, index }: SelectionListCardProps) {
  // Parse the content to extract sections
  const parseContent = () => {
    const lines = content.split('\n');
    const sections: { type: 'intro' | 'alternative' | 'bullet' | 'text'; content: string; altNumber?: number }[] = [];
    let currentAltNumber = 0;
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      // Check for Alternative headers (#### Alternative X: or similar patterns)
      const altMatch = trimmed.match(/^#{1,4}\s*Alternative\s*(\d+):?\s*(.+)/i);
      if (altMatch) {
        currentAltNumber = parseInt(altMatch[1]);
        sections.push({
          type: 'alternative',
          content: altMatch[2],
          altNumber: currentAltNumber
        });
        return;
      }
      
      // Check for numbered recommendations (1. For the...)
      const numberedMatch = trimmed.match(/^(\d+)\.\s*\*?\*?For\s+/i);
      if (numberedMatch) {
        currentAltNumber = parseInt(numberedMatch[1]);
        sections.push({
          type: 'alternative',
          content: trimmed.replace(/^\d+\.\s*/, ''),
          altNumber: currentAltNumber
        });
        return;
      }
      
      // Check for bullet points
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        sections.push({
          type: 'bullet',
          content: trimmed.replace(/^[\*\-]\s*/, '')
        });
        return;
      }
      
      // Check if first few lines are intro
      if (sections.length === 0 || (sections.length > 0 && sections.every(s => s.type === 'intro' || s.type === 'text'))) {
        sections.push({
          type: 'intro',
          content: trimmed
        });
        return;
      }
      
      sections.push({
        type: 'text',
        content: trimmed
      });
    });
    
    return sections;
  };
  
  const sections = parseContent();
  
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
      
      <div className="space-y-4">
        {sections.map((section, i) => {
          if (section.type === 'intro') {
            return (
              <p key={i} className="section-content">
                <FormattedText content={section.content} />
              </p>
            );
          }
          
          if (section.type === 'alternative') {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                className="relative group"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-glow-blue/15 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-primary/10 to-glow-blue/5 border-2 border-primary/30 hover:border-primary/50 transition-all duration-300">
                  {/* Alternative Badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40"
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 hsl(var(--primary) / 0.3)',
                          '0 0 10px 2px hsl(var(--primary) / 0.2)',
                          '0 0 0 0 hsl(var(--primary) / 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">
                        Alternative {section.altNumber}
                      </span>
                    </motion.div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {/* Alternative Title */}
                  <h4 className="text-lg font-bold text-foreground leading-relaxed">
                    <FormattedText content={section.content} />
                  </h4>
                </div>
              </motion.div>
            );
          }
          
          if (section.type === 'bullet') {
            return (
              <div key={i} className="flex items-start gap-3 pl-4 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <FormattedText content={section.content} />
                </p>
              </div>
            );
          }
          
          return (
            <p key={i} className="section-content pl-4">
              <FormattedText content={section.content} />
            </p>
          );
        })}
      </div>
    </motion.div>
  );
}
