import { motion, AnimatePresence } from "framer-motion";
import { AwaitingPlaceholder } from "./AwaitingPlaceholder";
import { ProcessingGauge } from "./ProcessingGauge";
import { DiagnosticCard } from "./DiagnosticCard";
import { SelectionListCard } from "./SelectionListCard";
import { ScientificJustificationCard } from "./ScientificJustificationCard";
import { ProfitabilityCard } from "./ProfitabilityCard";
import { SummaryCard } from "./SummaryCard";
import { RootCauseCard } from "./RootCauseCard";
import { DynamicResultCard } from "./DynamicDataRenderer";
import { SafetyWarningBadge } from "./SafetyWarningBadge";
import { ComparisonTable } from "./ComparisonTable";
import { QASection } from "./QASection";
import { DisplayDataRenderer } from "./DisplayDataRenderer";
import { CheckCircle2, Download, Save, Plus } from "lucide-react";
import jsPDF from "jspdf";

interface DisplayData {
  recommended_material?: string;
  comparison_table_markdown?: string;
  confidence_score?: string;
  detailed_report?: string;
  [key: string]: unknown;
}

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
  display_data?: DisplayData;
  success?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

interface ResultsPanelProps {
  status: "idle" | "loading" | "success" | "error";
  data: ResultsData | null;
  error?: string;
  onSaveProject?: () => void;
  onNewProject?: () => void;
}

const KNOWN_KEYS = [
  'summary', 'diagnostic', 'root_cause', 'selection_list',
  'scientific_justification', 'profitability_analysis', 'safety_warning',
  'comparison', 'display_data', 'success', 'timestamp'
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

export function ResultsPanel({ status, data, error, onSaveProject, onNewProject }: ResultsPanelProps) {
  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Technical Analysis Report", margin, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 15;

    const addSection = (title: string, content: string) => {
      if (yPosition > 250) { doc.addPage(); yPosition = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, yPosition);
      yPosition += 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(content, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) { doc.addPage(); yPosition = 20; }
        doc.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 10;
    };

    if (data.summary) addSection("Summary", data.summary.replace(/^#+\s*/gm, ''));
    if (data.diagnostic) addSection("Root Cause Diagnostic", data.diagnostic);
    if (data.root_cause) addSection("Root Cause Analysis", data.root_cause);
    if (data.selection_list) addSection("Recommended Solutions", data.selection_list);
    if (data.scientific_justification) addSection("Technical Deep-Dive", data.scientific_justification);
    if (data.profitability_analysis) addSection("Economic Impact", data.profitability_analysis);

    Object.entries(data).forEach(([key, value]) => {
      if (!KNOWN_KEYS.includes(key) && typeof value === 'string') {
        addSection(key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value);
      }
    });

    doc.save("material-analysis-report.pdf");
  };

  const unknownFields = data
    ? Object.entries(data)
        .filter(([key, value]) => !KNOWN_KEYS.includes(key) && value !== null && value !== undefined)
        .map(([key, value]) => ({ key, value }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-8 lg:p-10 h-full overflow-auto"
    >
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Analysis Results
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg">
            AI-powered material recommendations and technical analysis
          </p>
        </div>
      </div>

      {/* Action buttons when results are shown */}
      {status === "success" && data && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {onSaveProject && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSaveProject}
              className="flex items-center gap-2 px-5 py-3 text-base font-medium 
                         bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg 
                         hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)] transition-shadow"
            >
              <Save className="w-5 h-5" />
              <span>Save Project</span>
            </motion.button>
          )}
          
          {onNewProject && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewProject}
              className="flex items-center gap-2 px-5 py-3 text-base font-medium 
                         bg-card border border-border rounded-lg 
                         hover:bg-muted transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-3 text-base font-medium 
                       bg-card border border-border rounded-lg 
                       hover:bg-muted transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AwaitingPlaceholder />
          </motion.div>
        )}

        {status === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/30"
            >
              <CheckCircle2 className="w-6 h-6 text-success pulse-check" />
              <div>
                <p className="text-sm font-semibold text-success">Analysis Complete</p>
                <p className="text-xs text-muted-foreground">Technical report generated successfully</p>
              </div>
            </motion.div>

            {data.display_data && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
                <DisplayDataRenderer data={data.display_data} index={0} />
              </motion.div>
            )}

            {data.safety_warning && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={2}>
                <SafetyWarningBadge message={data.safety_warning} />
              </motion.div>
            )}

            {data.summary && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={3}>
                <SummaryCard content={data.summary} index={0} />
              </motion.div>
            )}

            {data.diagnostic && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={4}>
                <DiagnosticCard content={data.diagnostic} index={0} />
              </motion.div>
            )}

            {data.root_cause && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={5}>
                <RootCauseCard content={data.root_cause} index={0} />
              </motion.div>
            )}

            {data.comparison && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={6}>
                <ComparisonTable oldMaterial={data.comparison.oldMaterial} newMaterial={data.comparison.newMaterial} index={0} />
              </motion.div>
            )}

            {data.selection_list && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={7}>
                <SelectionListCard content={data.selection_list} index={0} />
              </motion.div>
            )}

            {data.scientific_justification && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={8}>
                <ScientificJustificationCard content={data.scientific_justification} index={0} />
              </motion.div>
            )}

            {data.profitability_analysis && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={9}>
                <ProfitabilityCard content={data.profitability_analysis} index={0} />
              </motion.div>
            )}

            {unknownFields.map((field, idx) => (
              <motion.div key={field.key} variants={sectionVariants} initial="hidden" animate="visible" custom={10 + idx}>
                <DynamicResultCard title={field.key} data={field.value} index={0} />
              </motion.div>
            ))}

            <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={10 + unknownFields.length}>
              <QASection resultsData={data} />
            </motion.div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
