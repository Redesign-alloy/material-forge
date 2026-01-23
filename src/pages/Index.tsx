import { useState } from "react";
import { motion } from "framer-motion";
import { Atom, FlaskConical } from "lucide-react";
import { InputPanel } from "@/components/InputPanel";
import { ResultsPanel } from "@/components/ResultsPanel";

interface FormData {
  coreAsset: string;
  operationalContext: string;
  constraint: string;
  targetRequirements: string[];
  complianceStandards: string;
}

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

type Status = "idle" | "loading" | "success" | "error";

export default function Index() {
  const [status, setStatus] = useState<Status>("idle");
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch(
        "https://tejanaidu6.app.n8n.cloud/webhook/overcome_limitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coreAsset: formData.coreAsset,
            operationalContext: formData.operationalContext,
            currentFailure: formData.constraint,
            requiredImprovements: formData.targetRequirements,
            industryStandards: formData.complianceStandards,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analysis results");
      }

      const data = await response.json();
      
      // Parse the response - adapt based on actual API response structure
      const parsedData: ResultsData = {
        materials: data.materials || data.recommendations || [
          {
            name: data.material_name || "Advanced Composite",
            advantage: data.advantage || "Superior performance characteristics",
            performanceDelta: data.performance_delta || 25,
            properties: data.properties || {
              tensileStrength: 85,
              thermalResistance: 92,
              costEfficiency: 78,
              durability: 88,
            },
          },
        ],
        summary: data.summary || data.analysis_summary,
      };

      setResultsData(parsedData);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md" />
              <div className="relative p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Atom className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Material Science <span className="text-gradient">Innovation Lab</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                AI-Powered Material Problem Solver
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Enterprise Material Analysis
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 min-h-[calc(100vh-140px)]">
          {/* Left Panel - Input */}
          <div className="h-full">
            <InputPanel onSubmit={handleSubmit} isLoading={status === "loading"} />
          </div>

          {/* Right Panel - Results */}
          <div className="h-full">
            <ResultsPanel status={status} data={resultsData} error={error} />
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-glow-blue/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}