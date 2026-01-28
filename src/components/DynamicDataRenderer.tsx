import { motion } from "framer-motion";
import { Table, List, FileText, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { FormattedText } from "@/lib/formatScientificText";

interface DynamicDataRendererProps {
  data: unknown;
  title?: string;
  index?: number;
  depth?: number;
}

// Type guards
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTableData(arr: unknown[]): arr is Record<string, unknown>[] {
  if (arr.length === 0) return false;
  return arr.every(item => isObject(item));
}

function isPrimitiveArray(arr: unknown[]): arr is (string | number | boolean)[] {
  return arr.every(item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean');
}

// Format key from snake_case or camelCase to Title Case
function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Parse string value for special formats
function parseStringValue(value: string): { type: 'text' | 'list' | 'numbered'; items: string[] } {
  const lines = value.split('\n').filter(line => line.trim());
  
  // Check if it's a numbered list
  if (lines.length > 1 && lines.every(line => /^\d+[\.\)]\s/.test(line.trim()))) {
    return { type: 'numbered', items: lines.map(line => line.replace(/^\d+[\.\)]\s*/, '').trim()) };
  }
  
  // Check if it's a bullet list
  if (lines.length > 1 && lines.every(line => /^[\*\-•]\s/.test(line.trim()))) {
    return { type: 'list', items: lines.map(line => line.replace(/^[\*\-•]\s*/, '').trim()) };
  }
  
  return { type: 'text', items: lines };
}

// Render a clean table from array of objects
function DynamicTable({ data, index = 0 }: { data: Record<string, unknown>[]; index?: number }) {
  if (data.length === 0) return null;
  
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
  const headers = Array.from(allKeys);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-glow-blue/5"
    >
      <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 border-b border-primary/20">
        <Table className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Comparison Table</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {headers.map(header => (
                <th key={header} className="py-3 px-4 text-left font-medium text-primary">
                  {formatKey(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <motion.tr
                key={rowIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + rowIdx) * 0.05 }}
                className={rowIdx < data.length - 1 ? "border-b border-border/30" : ""}
              >
                {headers.map(header => {
                  const value = row[header];
                  return (
                    <td key={header} className="py-3 px-4 text-foreground">
                      {typeof value === 'string' ? (
                        <FormattedText content={value} />
                      ) : typeof value === 'number' || typeof value === 'boolean' ? (
                        String(value)
                      ) : value === null || value === undefined ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        JSON.stringify(value)
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Render a list of primitive values
function PrimitiveList({ items, type, index = 0 }: { items: (string | number | boolean)[]; type: 'list' | 'numbered'; index?: number }) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (index + idx) * 0.05 }}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
        >
          {type === 'numbered' ? (
            <span className="text-primary font-semibold min-w-[24px]">{idx + 1}.</span>
          ) : (
            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          )}
          <span className="text-sm text-foreground leading-relaxed">
            <FormattedText content={String(item)} />
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// Render text content with proper formatting
function TextContent({ content, index = 0 }: { content: string; index?: number }) {
  const parsed = parseStringValue(content);
  
  if (parsed.type === 'numbered' || parsed.type === 'list') {
    return <PrimitiveList items={parsed.items} type={parsed.type} index={index} />;
  }
  
  return (
    <div className="space-y-2">
      {parsed.items.map((line, idx) => {
        const trimmed = line.trim();
        
        // Bullet points
        if (trimmed.startsWith('*') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + idx) * 0.03 }}
              className="flex items-start gap-3 pl-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm lg:text-base text-foreground leading-relaxed">
                <FormattedText content={trimmed.replace(/^[\*\-•]\s*/, '')} />
              </p>
            </motion.div>
          );
        }
        
        // Numbered items
        const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s*(.*)/);
        if (numberedMatch) {
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + idx) * 0.03 }}
              className="flex items-start gap-3"
            >
              <span className="text-primary font-semibold min-w-[24px]">{numberedMatch[1]}.</span>
              <p className="text-sm lg:text-base text-foreground leading-relaxed">
                <FormattedText content={numberedMatch[2]} />
              </p>
            </motion.div>
          );
        }
        
        // Bold headers (lines ending with :)
        if (trimmed.endsWith(':') && trimmed.length < 100) {
          return (
            <motion.p 
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: (index + idx) * 0.03 }}
              className="text-base lg:text-lg font-semibold text-foreground mt-3"
            >
              <FormattedText content={trimmed} />
            </motion.p>
          );
        }
        
        return (
          <motion.p 
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (index + idx) * 0.03 }}
            className="text-sm lg:text-base text-muted-foreground leading-relaxed"
          >
            <FormattedText content={trimmed} />
          </motion.p>
        );
      })}
    </div>
  );
}

// Key-Value pair with special formatting for materials
function KeyValuePair({ keyName, value, index = 0, isMaterial = false }: { keyName: string; value: unknown; index?: number; isMaterial?: boolean }) {
  const formattedKey = formatKey(keyName);
  
  // Check if this looks like a material recommendation
  const materialKeywords = ['material', 'alternative', 'recommendation', 'alloy', 'composite', 'ceramic', 'polymer'];
  const isMaterialValue = isMaterial || materialKeywords.some(kw => keyName.toLowerCase().includes(kw));
  
  if (typeof value === 'string') {
    if (isMaterialValue && value.length < 100) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative p-4 rounded-xl bg-gradient-to-br from-primary/10 via-glow-blue/5 to-primary/5 
                     border border-primary/30 overflow-hidden"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="relative flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">{formattedKey}</p>
              <p className="text-base font-semibold text-foreground">
                <FormattedText content={value} />
              </p>
            </div>
          </div>
        </motion.div>
      );
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ArrowRight className="w-4 h-4 text-primary" />
          {formattedKey}
        </div>
        <div className="pl-6">
          <TextContent content={value} index={index} />
        </div>
      </motion.div>
    );
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
      >
        <span className="text-sm font-medium text-foreground">{formattedKey}</span>
        <span className="text-sm text-primary font-semibold">{String(value)}</span>
      </motion.div>
    );
  }
  
  if (Array.isArray(value)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <List className="w-4 h-4 text-primary" />
          {formattedKey}
        </div>
        <div className="pl-6">
          <DynamicDataRenderer data={value} index={index} depth={1} />
        </div>
      </motion.div>
    );
  }
  
  if (isObject(value)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="w-4 h-4 text-primary" />
          {formattedKey}
        </div>
        <div className="pl-6 p-4 rounded-lg bg-muted/20 border border-border/50">
          <DynamicDataRenderer data={value} index={index} depth={1} />
        </div>
      </motion.div>
    );
  }
  
  return null;
}

// Main dynamic renderer component
export function DynamicDataRenderer({ data, title, index = 0, depth = 0 }: DynamicDataRendererProps) {
  // Handle null/undefined
  if (data === null || data === undefined) {
    return null;
  }
  
  // Handle string
  if (typeof data === 'string') {
    // Try to parse as JSON
    if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(data);
        return <DynamicDataRenderer data={parsed} title={title} index={index} depth={depth} />;
      } catch {
        // Not valid JSON, render as text
      }
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {title && (
          <div className="section-title mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span>{formatKey(title)}</span>
          </div>
        )}
        <TextContent content={data} index={index} />
      </motion.div>
    );
  }
  
  // Handle number/boolean
  if (typeof data === 'number' || typeof data === 'boolean') {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-primary font-semibold"
      >
        {String(data)}
      </motion.span>
    );
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    
    // Array of objects -> render as table
    if (isTableData(data)) {
      return <DynamicTable data={data} index={index} />;
    }
    
    // Array of primitives -> render as list
    if (isPrimitiveArray(data)) {
      return <PrimitiveList items={data} type="list" index={index} />;
    }
    
    // Mixed array -> render each item
    return (
      <div className="space-y-4">
        {data.map((item, idx) => (
          <DynamicDataRenderer key={idx} data={item} index={index + idx} depth={depth + 1} />
        ))}
      </div>
    );
  }
  
  // Handle objects
  if (isObject(data)) {
    const entries = Object.entries(data).filter(([_, value]) => value !== null && value !== undefined);
    
    if (entries.length === 0) return null;
    
    // Check if it looks like a single Output field
    if (entries.length === 1 && (entries[0][0].toLowerCase() === 'output' || entries[0][0].toLowerCase() === 'response')) {
      return <DynamicDataRenderer data={entries[0][1]} title={title} index={index} depth={depth} />;
    }
    
    return (
      <div className={`space-y-4 ${depth > 0 ? '' : ''}`}>
        {title && depth === 0 && (
          <div className="section-title mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span>{formatKey(title)}</span>
          </div>
        )}
        {entries.map(([key, value], idx) => (
          <KeyValuePair 
            key={key} 
            keyName={key} 
            value={value} 
            index={index + idx}
            isMaterial={depth === 0 && idx === 0}
          />
        ))}
      </div>
    );
  }
  
  return null;
}

// Card wrapper for dynamic data
export function DynamicResultCard({ 
  title, 
  data, 
  index = 0 
}: { 
  title: string; 
  data: unknown; 
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card"
    >
      <DynamicDataRenderer data={data} title={title} index={index} />
    </motion.div>
  );
}
