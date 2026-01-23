import { motion, AnimatePresence } from "framer-motion";
import { AwaitingPlaceholder } from "./AwaitingPlaceholder";
import { ProcessingGauge } from "./ProcessingGauge";
import { MaterialCard } from "./MaterialCard";
import { CheckCircle2, Sparkles } from "lucide-react";

interface Material {
  name: string;
  advantage: string;
  performanceDelta: number;
  properties?: {
    tensileStrength?: number;
    thermalResistance?: number;
    costEfficiency?: number;
    durability?: number;
  };
}

interface ResultsData {
  materials: Material[];
  summary?: string;
}

interface ResultsPanelProps {
  status: "idle" | "loading" | "success" | "error";
  data: ResultsData | null;
  error?: string;
}

export function ResultsPanel({ status, data, error }: ResultsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel p-6 lg:p-8 h-full overflow-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          Analysis Results
        </h2>
        <p className="text-muted-foreground text-sm">
          AI-recommended materials based on your specifications
        </p>
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
                  {data.materials.length} material{data.materials.length !== 1 ? "s" : ""} recommended
                </p>
              </div>
            </motion.div>

            {/* Summary */}
            {data.summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.summary}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Material Cards */}
            <div className="grid gap-4">
              {data.materials.map((material, index) => (
                <MaterialCard key={material.name} material={material} index={index} />
              ))}
            </div>
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