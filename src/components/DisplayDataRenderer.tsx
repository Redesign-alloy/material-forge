import { motion } from "framer-motion";
import { Sparkles, Download, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { FormattedText, parseFormulas } from "@/lib/formatScientificText";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";

interface DisplayData {
  recommended_material?: string;
  comparison_table_markdown?: string;
  confidence_score?: string;
  detailed_report?: string;
  [key: string]: unknown;
}

interface DisplayDataRendererProps {
  data: DisplayData;
  index?: number;
}

// Parse markdown table into structured data
function parseMarkdownTable(markdown: string): { headers: string[]; rows: string[][] } {
  const lines = markdown.trim().split('\n').filter(line => line.trim());
  
  if (lines.length < 2) return { headers: [], rows: [] };
  
  // Extract headers from first line
  const headers = lines[0]
    .split('|')
    .map(h => h.trim())
    .filter(h => h && !h.match(/^:?-+:?$/));
  
  // Skip separator line (index 1) and extract data rows
  const rows = lines.slice(2).map(line => 
    line.split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '')
  );
  
  return { headers, rows };
}

// Get confidence level color and icon
function getConfidenceStyle(score: string): { color: string; bgColor: string; icon: React.ReactNode; level: string } {
  const scoreMatch = score.match(/(\d+)\/(\d+)/);
  if (scoreMatch) {
    const [, current, max] = scoreMatch;
    const ratio = parseInt(current) / parseInt(max);
    
    if (ratio >= 0.8) {
      return {
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50 border-emerald-200',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        level: 'High Confidence'
      };
    } else if (ratio >= 0.5) {
      return {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50 border-amber-200',
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        level: 'Medium Confidence'
      };
    }
  }
  
  return {
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    level: 'Low Confidence'
  };
}

// Parse detailed report sections
function parseDetailedReport(report: string): { title: string; content: string; emoji?: string }[] {
  const sections: { title: string; content: string; emoji?: string }[] = [];
  
  // Split by ### headers
  const parts = report.split(/(?=^### )/gm);
  
  parts.forEach(part => {
    const lines = part.trim().split('\n');
    if (lines.length === 0) return;
    
    const headerMatch = lines[0].match(/^### (.+)$/);
    if (headerMatch) {
      const fullTitle = headerMatch[1];
      // Extract emoji if present
      const emojiMatch = fullTitle.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])\s*(.+)$/u);
      
      sections.push({
        emoji: emojiMatch ? emojiMatch[1] : undefined,
        title: emojiMatch ? emojiMatch[2] : fullTitle,
        content: lines.slice(1).join('\n').trim()
      });
    } else if (part.trim()) {
      // Content without header
      sections.push({
        title: 'Overview',
        content: part.trim()
      });
    }
  });
  
  return sections;
}

// Render markdown content with proper formatting
function renderMarkdownContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let inList = false;
  let currentTable: string[] = [];
  let inTable = false;
  
  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="space-y-2 my-3">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span className="text-muted-foreground"><FormattedText content={item} /></span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = (key: number) => {
    if (currentTable.length > 0) {
      const { headers, rows } = parseMarkdownTable(currentTable.join('\n'));
      if (headers.length > 0) {
        elements.push(
          <div key={`table-${key}`} className="my-4 overflow-x-auto">
            <ComparisonTableInline headers={headers} rows={rows} />
          </div>
        );
      }
      currentTable = [];
    }
  };
  
  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    
    // Check if it's a table line
    if (trimmedLine.startsWith('|')) {
      if (!inTable) {
        flushList(idx);
        inTable = true;
      }
      currentTable.push(trimmedLine);
      return;
    } else if (inTable) {
      flushTable(idx);
      inTable = false;
    }
    
    // Bold headers like **text:**
    if (trimmedLine.match(/^\*\*[^*]+\*\*:?$/)) {
      flushList(idx);
      inList = false;
      const text = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '');
      elements.push(
        <h4 key={idx} className="font-semibold text-foreground mt-4 mb-2">
          <FormattedText content={text} />
        </h4>
      );
      return;
    }
    
    // Numbered or bullet list items
    if (trimmedLine.match(/^(\d+\.|[-*])\s+/)) {
      inList = true;
      const itemContent = trimmedLine.replace(/^(\d+\.|[-*])\s+/, '');
      listItems.push(itemContent);
      return;
    }
    
    // Sub-items with indentation
    if (trimmedLine.match(/^\*\s+\*\*[^*]+\*\*/)) {
      const itemContent = trimmedLine.replace(/^\*\s+/, '');
      listItems.push(itemContent);
      return;
    }
    
    // Empty line ends list
    if (!trimmedLine && inList) {
      flushList(idx);
      inList = false;
      return;
    }
    
    // Regular paragraph
    if (trimmedLine && !inList) {
      flushList(idx);
      elements.push(
        <p key={idx} className="text-muted-foreground my-2 leading-relaxed">
          <FormattedText content={trimmedLine} />
        </p>
      );
    }
  });
  
  // Flush any remaining items
  flushList(lines.length);
  flushTable(lines.length + 1);
  
  return <>{elements}</>;
}

// Inline comparison table component
function ComparisonTableInline({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary/5 to-primary/10">
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-4 py-3 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                >
                  <FormattedText content={header} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className={`
                  transition-colors hover:bg-muted/50
                  ${rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                `}
              >
                {row.map((cell, cellIdx) => (
                  <td 
                    key={cellIdx} 
                    className={`
                      px-4 py-3 border-b border-border/50
                      ${cellIdx === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}
                    `}
                  >
                    <FormattedText content={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DisplayDataRenderer({ data, index = 0 }: DisplayDataRendererProps) {
  const [isDetailedExpanded, setIsDetailedExpanded] = useState(true);
  
  const { headers, rows } = data.comparison_table_markdown 
    ? parseMarkdownTable(data.comparison_table_markdown) 
    : { headers: [], rows: [] };
    
  const confidenceStyle = data.confidence_score 
    ? getConfidenceStyle(data.confidence_score) 
    : null;
    
  const reportSections = data.detailed_report 
    ? parseDetailedReport(data.detailed_report) 
    : [];

  const handleDownloadReport = () => {
    if (!data.detailed_report) return;
    
    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 6;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Analysis Report", margin, yPosition);
    yPosition += 12;

    // Date and recommended material
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 8;
    
    if (data.recommended_material) {
      doc.setFont("helvetica", "bold");
      doc.text(`Recommended Material: ${data.recommended_material}`, margin, yPosition);
      yPosition += 8;
    }
    
    if (data.confidence_score) {
      doc.setFont("helvetica", "normal");
      doc.text(`Confidence: ${data.confidence_score}`, margin, yPosition);
      yPosition += 12;
    }

    // Add detailed report content
    const cleanContent = parseFormulas(data.detailed_report)
      .replace(/### /g, '\n\n')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\|/g, ' | ')
      .replace(/-{3,}/g, '---');

    doc.setFontSize(9);
    const lines = doc.splitTextToSize(cleanContent, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    doc.save("detailed-technical-report.pdf");
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Recommended Material */}
      {data.recommended_material && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden"
        >
          <div 
            className="p-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10"
            style={{
              boxShadow: '0 0 30px rgba(var(--primary), 0.15), 0 0 60px rgba(var(--primary), 0.05)'
            }}
          >
            {/* Breathing glow animation */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.1)',
                  '0 0 40px rgba(59, 130, 246, 0.2)',
                  '0 0 20px rgba(59, 130, 246, 0.1)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="relative flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Recommended Material(s)</h3>
            </div>
            
            <div className="relative flex flex-wrap gap-2">
              {data.recommended_material.split(',').map((material, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <Badge 
                    className="px-4 py-2 text-base font-medium bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {material.trim()}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 2: Comparison Table */}
      {headers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.1 }}
          className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-border bg-gradient-to-r from-muted/30 to-muted/10">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl">📊</span> Property Comparison
            </h3>
          </div>
          
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  {headers.map((header, idx) => (
                    <motion.th 
                      key={idx}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className={`
                        px-4 py-3 text-left font-semibold text-foreground border-b-2 border-primary/20 whitespace-nowrap
                        ${idx === 0 ? 'bg-primary/5' : ''}
                        ${idx > 1 ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}
                      `}
                    >
                      <FormattedText content={header} />
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <motion.tr 
                    key={rowIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + rowIdx * 0.03 }}
                    className={`
                      transition-all hover:bg-muted/50 group
                      ${rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                    `}
                  >
                    {row.map((cell, cellIdx) => (
                      <td 
                        key={cellIdx} 
                        className={`
                          px-4 py-3 border-b border-border/50
                          ${cellIdx === 0 ? 'font-medium text-foreground bg-muted/30' : 'text-muted-foreground'}
                          ${cellIdx > 1 ? 'bg-emerald-50/30 dark:bg-emerald-900/5' : ''}
                        `}
                      >
                        <FormattedText content={cell} />
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Section 3: Confidence Score */}
      {data.confidence_score && confidenceStyle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className={`p-5 rounded-xl border ${confidenceStyle.bgColor}`}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {confidenceStyle.icon}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${confidenceStyle.color}`}>
                  {confidenceStyle.level}
                </span>
                <Badge variant="outline" className={confidenceStyle.color}>
                  {data.confidence_score.split(' - ')[0]}
                </Badge>
              </div>
              {data.confidence_score.includes(' - ') && (
                <p className="text-sm text-muted-foreground">
                  {data.confidence_score.split(' - ').slice(1).join(' - ')}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Section 4: Detailed Report */}
      {data.detailed_report && reportSections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
        >
          <div 
            className="p-4 border-b border-border bg-gradient-to-r from-muted/30 to-muted/10 flex items-center justify-between cursor-pointer"
            onClick={() => setIsDetailedExpanded(!isDetailedExpanded)}
          >
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="text-xl">📋</span> Detailed Technical Report
            </h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadReport();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </motion.button>
              <motion.div
                animate={{ rotate: isDetailedExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={false}
            animate={{ 
              height: isDetailedExpanded ? 'auto' : 0,
              opacity: isDetailedExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {reportSections.map((section, sectionIdx) => (
                <motion.div
                  key={sectionIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * sectionIdx }}
                  className="border-l-4 border-primary/30 pl-4"
                >
                  <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    {section.emoji && <span className="text-xl">{section.emoji}</span>}
                    {section.title}
                  </h4>
                  <div className="text-muted-foreground">
                    {renderMarkdownContent(section.content)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
