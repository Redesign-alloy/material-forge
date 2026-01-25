import { motion, AnimatePresence } from "framer-motion";
import { AwaitingPlaceholder } from "./AwaitingPlaceholder";
import { ProcessingGauge } from "./ProcessingGauge";
import { DiagnosticCard } from "./DiagnosticCard";
import { SelectionListCard } from "./SelectionListCard";
import { ScientificJustificationCard } from "./ScientificJustificationCard";
import { ProfitabilityCard } from "./ProfitabilityCard";
import { SummaryCard } from "./SummaryCard";
import { RootCauseCard } from "./RootCauseCard";
import { GenericResultCard } from "./GenericResultCard";
import { SafetyWarningBadge } from "./SafetyWarningBadge";
import { ComparisonTable } from "./ComparisonTable";
import { QASection } from "./QASection";
import { CheckCircle2, Download } from "lucide-react";
import jsPDF from "jspdf";
interface ResultsData {
  summary?: string;
  diagnostic?: string;
  root_cause?: string;
  selection_list?: string;
  scientific_justification?: string;
  profitability_analysis?: string;
  safety_warning?: string;
  comparison?: {
    oldMaterial?: {
      name: string;
      density?: string;
      operatingTemp?: string;
      tensileStrength?: string;
    };
    newMaterial?: {
      name: string;
      density?: string;
      operatingTemp?: string;
      tensileStrength?: string;
    };
  };
  [key: string]: unknown;
}

interface ResultsPanelProps {
  status: "idle" | "loading" | "success" | "error";
  data: ResultsData | null;
  error?: string;
}

const KNOWN_KEYS = [
  'summary',
  'diagnostic', 
  'root_cause',
  'selection_list',
  'scientific_justification',
  'profitability_analysis',
  'safety_warning',
  'comparison'
];

export function ResultsPanel({ status, data, error }: ResultsPanelProps) {
  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Analysis Report", margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;

    const addSection = (title: string, content: string) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(content, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 10;
    };

    // Add sections
    if (data.summary) addSection("Summary", data.summary.replace(/^#+\s*/gm, ''));
    if (data.diagnostic) addSection("Root Cause Diagnostic", data.diagnostic);
    if (data.root_cause) addSection("Root Cause Analysis", data.root_cause);
    if (data.selection_list) addSection("Recommended Solutions", data.selection_list);
    if (data.scientific_justification) addSection("Technical Deep-Dive", data.scientific_justification);
    if (data.profitability_analysis) addSection("Economic Impact", data.profitability_analysis);

    // Add any additional unknown fields
    Object.entries(data).forEach(([key, value]) => {
      if (!KNOWN_KEYS.includes(key) && typeof value === 'string') {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        addSection(formattedKey, value);
      }
    });

    doc.save("material-analysis-report.pdf");
  };

  // Get unknown fields for dynamic rendering
  const getUnknownFields = () => {
    if (!data) return [];
    return Object.entries(data)
      .filter(([key, value]) => !KNOWN_KEYS.includes(key) && typeof value === 'string')
      .map(([key, value]) => ({ key, value: value as string }));
  };

  const unknownFields = getUnknownFields();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-6 lg:p-8 h-full overflow-auto"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analysis Results
          </h2>
          <p className="text-muted-foreground text-sm">
            AI-powered material recommendations and technical analysis
          </p>
        </div>
        
        {status === "success" && data && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                       bg-card border border-border rounded-lg 
                       hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AwaitingPlaceholder />
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProcessingGauge isProcessing={true} />
          </motion.div>
        )}

        {status === "success" && data && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/30"
            >
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">
                  Analysis Complete
                </p>
                <p className="text-xs text-muted-foreground">
                  Technical report generated successfully
                </p>
              </div>
            </motion.div>

            {/* Safety Warning (if present) */}
            {data.safety_warning && (
              <SafetyWarningBadge message={data.safety_warning} />
            )}

            {/* Summary Card */}
            {data.summary && (
              <SummaryCard content={data.summary} index={0} />
            )}

            {/* Diagnostic Card */}
            {data.diagnostic && (
              <DiagnosticCard content={data.diagnostic} index={1} />
            )}

            {/* Root Cause Card */}
            {data.root_cause && (
              <RootCauseCard content={data.root_cause} index={2} />
            )}

            {/* Comparison Table */}
            {data.comparison && (
              <ComparisonTable 
                oldMaterial={data.comparison.oldMaterial}
                newMaterial={data.comparison.newMaterial}
                index={3}
              />
            )}

            {/* Selection List Card */}
            {data.selection_list && (
              <SelectionListCard content={data.selection_list} index={4} />
            )}

            {/* Scientific Justification */}
            {data.scientific_justification && (
              <ScientificJustificationCard content={data.scientific_justification} index={5} />
            )}

            {/* Profitability Analysis */}
            {data.profitability_analysis && (
              <ProfitabilityCard content={data.profitability_analysis} index={6} />
            )}

            {/* Dynamic Unknown Fields */}
            {unknownFields.map((field, index) => (
              <GenericResultCard 
                key={field.key}
                title={field.key}
                content={field.value}
                index={7 + index}
              />
            ))}

            {/* Q&A Section */}
            <QASection resultsData={data} />
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
              <p className="text-destructive font-medium mb-1">Analysis Failed</p>
              <p className="text-sm text-muted-foreground">
                {error || "An unexpected error occurred. Please try again."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
