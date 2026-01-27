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

      const rawData = await response.json();
      
      // Handle array response (webhook returns array with single object)
      const data = Array.isArray(rawData) ? rawData[0] : rawData;
      
      // Map the response directly - the webhook returns the exact structure we need
      const parsedData: ResultsData = {
        summary: data.summary,
        diagnostic: data.diagnostic,
        root_cause: data.root_cause,
        selection_list: data.selection_list,
        scientific_justification: data.scientific_justification,
        profitability_analysis: data.profitability_analysis,
        safety_warning: data.safety_warning,
        comparison: data.comparison,
      };

      // Add any additional unknown fields dynamically
      Object.keys(data).forEach(key => {
        if (!(key in parsedData)) {
          parsedData[key] = data[key];
        }
      });

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
        className="border-b border-border bg-card sticky top-0 z-50"
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Atom className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Material Science <span className="text-primary">Innovation Lab</span>
              </h1>
              <p className="text-sm lg:text-base text-muted-foreground">
                AI-Powered Material Problem Solver
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm lg:text-base text-muted-foreground hidden sm:inline">
                Enterprise Material Analysis
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 lg:px-12 py-8 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-[calc(100vh-160px)]">
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
    </div>
  );
}
