import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Loader2, ExternalLink, Table, ChevronRight } from 'lucide-react';
import { FormattedText, parseCitationsFromResponse, Citation } from '@/lib/formatScientificText';

interface QASectionProps {
  resultsData: Record<string, unknown>;
}

interface QAMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  parsedData?: ParsedResponse;
}

interface PropertyComparison {
  property: string;
  values: { material: string; value: string }[];
}

interface ParsedResponse {
  text: string;
  comparisons: PropertyComparison[];
  materials: string[];
  keyPoints: string[];
}

// Parse JSON data from response and extract structured information
function parseResponseData(data: unknown): ParsedResponse {
  const result: ParsedResponse = {
    text: '',
    comparisons: [],
    materials: [],
    keyPoints: []
  };

  // If it's a string, try to parse as JSON first
  if (typeof data === 'string') {
    // Check if it looks like JSON
    if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(data);
        return parseResponseData(parsed);
      } catch {
        // Not valid JSON, treat as text
        result.text = data;
        return result;
      }
    }
    result.text = data;
    return result;
  }

  // Handle array responses
  if (Array.isArray(data)) {
    if (data.length === 0) return result;
    
    // Process first item if it's an object
    if (typeof data[0] === 'object' && data[0] !== null) {
      return parseResponseData(data[0]);
    }
    
    // Array of strings
    result.keyPoints = data.filter(item => typeof item === 'string');
    return result;
  }

  // Handle object responses
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    
    // Extract text content from common fields
    const textFields = ['answer', 'response', 'message', 'content', 'text', 'output', 'Output'];
    for (const field of textFields) {
      if (obj[field] && typeof obj[field] === 'string') {
        result.text = obj[field] as string;
        break;
      }
    }

    // Extract materials
    if (obj.materials && Array.isArray(obj.materials)) {
      result.materials = obj.materials as string[];
    }

    // Extract comparisons
    if (obj.comparisons && Array.isArray(obj.comparisons)) {
      result.comparisons = obj.comparisons as PropertyComparison[];
    }

    // Extract properties as comparisons
    if (obj.properties && typeof obj.properties === 'object') {
      const props = obj.properties as Record<string, unknown>;
      Object.entries(props).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const comparison: PropertyComparison = {
            property: key,
            values: []
          };
          Object.entries(value as Record<string, string>).forEach(([material, val]) => {
            comparison.values.push({ material, value: String(val) });
          });
          result.comparisons.push(comparison);
        }
      });
    }

    // Extract key points from various fields
    const pointFields = ['keyPoints', 'key_points', 'points', 'highlights', 'findings'];
    for (const field of pointFields) {
      if (obj[field] && Array.isArray(obj[field])) {
        result.keyPoints = obj[field] as string[];
        break;
      }
    }

    // If no text was found, create a summary from the object
    if (!result.text && result.comparisons.length === 0 && result.keyPoints.length === 0) {
      // Recursively extract all text values
      result.text = extractTextFromObject(obj);
    }
  }

  return result;
}

function extractTextFromObject(obj: Record<string, unknown>, depth = 0): string {
  if (depth > 3) return '';
  
  const lines: string[] = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    // Skip internal fields
    if (key.startsWith('_')) return;
    
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    if (typeof value === 'string') {
      lines.push(`**${formattedKey}:** ${value}`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`**${formattedKey}:** ${String(value)}`);
    } else if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) {
        lines.push(`**${formattedKey}:**`);
        value.forEach(item => lines.push(`• ${item}`));
      }
    } else if (typeof value === 'object' && value !== null) {
      const nested = extractTextFromObject(value as Record<string, unknown>, depth + 1);
      if (nested) {
        lines.push(`**${formattedKey}:**`);
        lines.push(nested);
      }
    }
  });
  
  return lines.join('\n');
}

export function QASection({ resultsData }: QASectionProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();
    setQuestion('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://tejanaidu9.app.n8n.cloud/webhook/Q&A_overcome_limitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          context: resultsData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Parse the response data
      const parsedData = parseResponseData(data);
      
      // Parse citations from response text
      const { cleanText, citations } = parseCitationsFromResponse(parsedData.text);
      parsedData.text = cleanText;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanText,
        citations,
        parsedData
      }]);
    } catch (error) {
      console.error('Q&A Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your question. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderComparisonTable = (comparisons: PropertyComparison[]) => {
    if (comparisons.length === 0) return null;

    // Get all unique materials
    const allMaterials = new Set<string>();
    comparisons.forEach(comp => {
      comp.values.forEach(v => allMaterials.add(v.material));
    });
    const materials = Array.from(allMaterials);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-4 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-glow-blue/5"
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 border-b border-primary/20">
          <Table className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Property Comparison</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-3 px-4 text-left font-medium text-muted-foreground">Property</th>
                {materials.map(mat => (
                  <th key={mat} className="py-3 px-4 text-center font-medium text-primary">{mat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp, i) => (
                <motion.tr 
                  key={comp.property}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={i < comparisons.length - 1 ? "border-b border-border/30" : ""}
                >
                  <td className="py-3 px-4 font-medium text-foreground">{comp.property}</td>
                  {materials.map(mat => {
                    const value = comp.values.find(v => v.material === mat)?.value || '—';
                    return (
                      <td key={mat} className="py-3 px-4 text-center text-foreground">{value}</td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderKeyPoints = (points: string[]) => {
    if (points.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 space-y-2"
      >
        {points.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
          >
            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foreground"><FormattedText content={point} /></span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderMessageContent = (message: QAMessage) => {
    const lines = message.content.split('\n');
    
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          if (!line.trim()) return <br key={idx} />;
          
          // Check if line starts with number (numbered list)
          const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
          if (numberedMatch) {
            return (
              <motion.div 
                key={idx} 
                className="flex gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <span className="text-primary font-semibold min-w-[20px]">{numberedMatch[1]}.</span>
                <span><FormattedText content={numberedMatch[2]} /></span>
              </motion.div>
            );
          }
          
          // Check for bullet points
          if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
            return (
              <motion.div 
                key={idx} 
                className="flex gap-2 pl-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <span className="text-primary">•</span>
                <span><FormattedText content={line.replace(/^[\s*\-•]+/, '')} /></span>
              </motion.div>
            );
          }

          // Check for bold sections
          if (line.includes('**')) {
            return (
              <motion.p 
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <FormattedText content={line} />
              </motion.p>
            );
          }
          
          return (
            <motion.p 
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <FormattedText content={line} />
            </motion.p>
          );
        })}

        {/* Render parsed comparisons */}
        {message.parsedData?.comparisons && renderComparisonTable(message.parsedData.comparisons)}

        {/* Render key points */}
        {message.parsedData?.keyPoints && renderKeyPoints(message.parsedData.keyPoints)}
        
        {/* Citations Section */}
        {message.citations && message.citations.length > 0 && (
          <motion.div 
            className="mt-4 pt-4 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">References:</p>
            <div className="space-y-1">
              {message.citations.map((citation) => (
                <motion.a
                  key={citation.number}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: citation.number * 0.1 }}
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-[10px] font-medium">
                    {citation.number}
                  </span>
                  <span className="truncate flex-1">{citation.title || citation.url}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="result-card mt-6"
    >
      <div className="section-title">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span>Ask a Question</span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Have questions about the analysis? Ask anything about the recommended materials or technical details.
      </p>

      {/* Messages */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mb-4 max-h-[500px] overflow-y-auto"
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 lg:p-5 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-primary/5 border border-primary/20 ml-8'
                    : 'bg-gradient-to-br from-muted/50 to-muted/30 border border-border mr-4'
                }`}
              >
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  {msg.role === 'user' ? 'Your Question' : 'AI Response'}
                </p>
                <div className="text-sm lg:text-base text-foreground leading-relaxed">
                  {msg.role === 'user' ? msg.content : renderMessageContent(msg)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 text-sm text-muted-foreground mb-4 p-4 rounded-lg bg-muted/30"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Processing your question...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          className="flex-1 px-4 py-3 lg:py-4 rounded-lg bg-input border border-border text-foreground text-base
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                     focus:ring-primary/20 focus:border-primary/50 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-6 py-3 lg:py-4 bg-primary text-primary-foreground rounded-lg font-medium text-base
                     hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </motion.div>
  );
}
