import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InputPanel } from "@/components/InputPanel";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  coreAsset: string;
  operationalContext: string;
  constraint: string;
  targetRequirements: string[];
  complianceStandards: string;
  maxPriceIncrement: number;
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
  display_data?: {
    recommended_material?: string;
    comparison_table_markdown?: string;
    confidence_score?: string;
    detailed_report?: string;
  };
  [key: string]: unknown;
}

type Status = "idle" | "loading" | "success" | "error";

const SESSION_KEY_RESULTS = "materialai_results";
const SESSION_KEY_STATUS = "materialai_status";
const SESSION_KEY_FORM = "materialai_last_form";

export default function Dashboard() {
  const [status, setStatus] = useState<Status>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY_STATUS);
    return (saved as Status) || "idle";
  });
  const [resultsData, setResultsData] = useState<ResultsData | null>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY_RESULTS);
    return saved ? JSON.parse(saved) : null;
  });
  const [lastFormData, setLastFormData] = useState<FormData | null>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY_FORM);
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  // Persist results to sessionStorage
  useEffect(() => {
    if (resultsData) {
      sessionStorage.setItem(SESSION_KEY_RESULTS, JSON.stringify(resultsData));
      sessionStorage.setItem(SESSION_KEY_STATUS, status);
    }
    if (lastFormData) {
      sessionStorage.setItem(SESSION_KEY_FORM, JSON.stringify(lastFormData));
    }
  }, [resultsData, status, lastFormData]);

  const handleNewProject = () => {
    setStatus("idle");
    setResultsData(null);
    setLastFormData(null);
    setError("");
    sessionStorage.removeItem(SESSION_KEY_RESULTS);
    sessionStorage.removeItem(SESSION_KEY_STATUS);
    sessionStorage.removeItem(SESSION_KEY_FORM);
  };

  const handleSaveProject = async () => {
    if (!resultsData || !lastFormData || !user?.email) return;

    try {
      await supabase.from('material_innovation_data').insert({
        user_id: user.id,
        grade_name: lastFormData.coreAsset,
        redesign_data: resultsData,
        created_at: new Date().toISOString(),
      });

      // Increment search count
      const { data: existingUser } = await supabase
        .from('user_data')
        .select('search_count')
        .eq('email', user.email)
        .single();

      const currentCount = existingUser?.search_count || 0;
      await supabase.from('user_data').upsert({
        email: user.email,
        search_count: currentCount + 1,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      toast({
        title: "Project Saved",
        description: "Your analysis has been saved to Saved Projects.",
      });
    } catch (dbError) {
      console.error('Save error:', dbError);
      toast({
        title: "Save Failed",
        description: "Could not save the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setStatus("loading");
    setError("");
    setLastFormData(formData);

    try {
      const response = await fetch(
        "https://tejanaidu9.app.n8n.cloud/webhook/overcome_limitation",
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
            maxPriceIncrement: formData.maxPriceIncrement,
            user_id: user?.id,
            email: user?.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analysis results");
      }

      const rawData = await response.json();
      const data = Array.isArray(rawData) ? rawData[0] : rawData;

      const parsedData: ResultsData = {
        summary: data.summary,
        diagnostic: data.diagnostic,
        root_cause: data.root_cause,
        selection_list: data.selection_list,
        scientific_justification: data.scientific_justification,
        profitability_analysis: data.profitability_analysis,
        safety_warning: data.safety_warning,
        comparison: data.comparison,
        display_data: data.display_data,
      };

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
    <div className="max-w-[1800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Material Analysis <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-Powered Material Problem Solver
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <InputPanel onSubmit={handleSubmit} isLoading={status === "loading"} />
        </div>
        <div>
          <ResultsPanel
            status={status}
            data={resultsData}
            error={error}
            onSaveProject={handleSaveProject}
            onNewProject={handleNewProject}
          />
        </div>
      </div>
    </div>
  );
}
