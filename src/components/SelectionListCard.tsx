import { motion } from "framer-motion";
import { Lightbulb, Sparkles, ArrowRight, Scale } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface SelectionListCardProps {
  content: string;
  index: number;
}

interface PropertyComparison {
  property: string;
  material1Value: string;
  material2Value: string;
  material1Name: string;
  material2Name: string;
}

export function SelectionListCard({ content, index }: SelectionListCardProps) {
  // Parse the content to extract sections and property comparisons
  const parseContent = () => {
    const lines = content.split('\n');
    const sections: { 
      type: 'intro' | 'alternative' | 'bullet' | 'text' | 'comparison'; 
      content: string; 
      altNumber?: number;
      comparison?: PropertyComparison;
    }[] = [];
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

      // Check for property comparisons (e.g., "Young's Modulus: Material1: 200 GPa vs Material2: 180 GPa")
      const comparisonMatch = trimmed.match(/^[\*\-•]?\s*\*?\*?([^:]+)\*?\*?:\s*([^:]+):\s*([^(]+)\s*\(([^)]+)\)/i);
      if (comparisonMatch) {
        sections.push({
          type: 'comparison',
          content: trimmed,
          comparison: {
            property: comparisonMatch[1].replace(/\*\*/g, '').trim(),
            material1Name: comparisonMatch[2].trim(),
            material1Value: comparisonMatch[3].trim(),
            material2Name: '',
            material2Value: comparisonMatch[4].trim()
          }
        });
        return;
      }
      
      // Check for bullet points
      if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
        sections.push({
          type: 'bullet',
          content: trimmed.replace(/^[\*\-•]\s*/, '')
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

  // Extract and group property comparisons into tables
  const extractComparisonGroups = () => {
    const lines = content.split('\n');
    const groups: { title: string; properties: { name: string; value: string; context: string }[] }[] = [];
    let currentGroup: { title: string; properties: { name: string; value: string; context: string }[] } | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Check for section headers that might contain benchmarking data
      if (trimmed.match(/Empirical Benchmarking|Property Comparison|Material Properties/i)) {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { title: trimmed.replace(/[*#:]/g, '').trim(), properties: [] };
        return;
      }

      // Match property lines like "• Young's Modulus: Inconel 718: ~200 GPa (Similar to 316L...)"
      const propertyMatch = trimmed.match(/^[\*\-•]\s*\*?\*?([^:]+)\*?\*?:\s*(.+?):\s*([^(]+)(?:\(([^)]+)\))?/);
      if (propertyMatch && currentGroup) {
        currentGroup.properties.push({
          name: propertyMatch[1].replace(/\*\*/g, '').trim(),
          value: propertyMatch[3].trim(),
          context: propertyMatch[4] || ''
        });
      }
    });

    if (currentGroup && currentGroup.properties.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };
  
  const sections = parseContent();
  const comparisonGroups = extractComparisonGroups();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card border-l-4 border-primary"
    >
      <div className="section-title">
        <Lightbulb className="w-6 h-6 text-primary" />
        <span>Recommended Engineering Solutions</span>
      </div>
      
      <div className="space-y-5">
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
                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-75 blur-lg"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--glow-blue) / 0.2), hsl(var(--primary) / 0.3))'
                  }}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                {/* Soft breathing glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: '0 0 30px 5px hsl(var(--primary) / 0.15), inset 0 0 20px hsl(var(--primary) / 0.05)'
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 30px 5px hsl(var(--primary) / 0.15), inset 0 0 20px hsl(var(--primary) / 0.05)',
                      '0 0 50px 10px hsl(var(--primary) / 0.25), inset 0 0 30px hsl(var(--primary) / 0.1)',
                      '0 0 30px 5px hsl(var(--primary) / 0.15), inset 0 0 20px hsl(var(--primary) / 0.05)',
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                
                <div className="relative p-5 lg:p-6 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-glow-blue/10 border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm">
                  {/* Alternative Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/25 border border-primary/50"
                      animate={{ 
                        boxShadow: [
                          '0 0 0 0 hsl(var(--primary) / 0.4)',
                          '0 0 15px 4px hsl(var(--primary) / 0.3)',
                          '0 0 0 0 hsl(var(--primary) / 0.4)'
                        ]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-base font-bold text-primary">
                        Alternative {section.altNumber}
                      </span>
                    </motion.div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {/* Alternative Title */}
                  <h4 className="text-lg lg:text-xl font-bold text-foreground leading-relaxed">
                    <FormattedText content={section.content} />
                  </h4>
                </div>
              </motion.div>
            );
          }
          
          if (section.type === 'bullet') {
            return (
              <motion.div 
                key={i} 
                className="flex items-start gap-3 pl-4 py-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <p className="text-base text-muted-foreground leading-relaxed">
                  <FormattedText content={section.content} />
                </p>
              </motion.div>
            );
          }
          
          return (
            <p key={i} className="section-content pl-4">
              <FormattedText content={section.content} />
            </p>
          );
        })}

        {/* Property Comparison Tables */}
        {comparisonGroups.map((group, groupIdx) => (
          <motion.div
            key={groupIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + groupIdx * 0.15, duration: 0.5 }}
            className="mt-6 overflow-hidden rounded-xl border-2 border-glow-cyan/30 bg-gradient-to-br from-glow-cyan/5 via-transparent to-primary/5"
          >
            {/* Table Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-glow-cyan/15 to-primary/10 border-b border-glow-cyan/20">
              <Scale className="w-5 h-5 text-glow-cyan" />
              <span className="text-base font-semibold text-foreground">{group.title}</span>
            </div>
            
            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="py-4 px-5 text-left font-semibold text-muted-foreground">Property</th>
                    <th className="py-4 px-5 text-center font-semibold text-primary">Value</th>
                    <th className="py-4 px-5 text-left font-semibold text-muted-foreground">Comparison Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {group.properties.map((prop, propIdx) => (
                    <motion.tr
                      key={propIdx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + propIdx * 0.1 }}
                      className={propIdx < group.properties.length - 1 ? "border-b border-border/30" : ""}
                    >
                      <td className="py-4 px-5 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-glow-cyan" />
                          {prop.name}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className="inline-block px-3 py-1.5 rounded-lg bg-primary/15 text-primary font-semibold border border-primary/30">
                          {prop.value}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground italic">
                        {prop.context || '—'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
