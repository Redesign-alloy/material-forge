 import { useState } from "react";
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
 
 export default function Dashboard() {
   const [status, setStatus] = useState<Status>("idle");
   const [resultsData, setResultsData] = useState<ResultsData | null>(null);
   const [error, setError] = useState<string>("");
   const { user } = useAuth();
   const { toast } = useToast();
 
   const handleSubmit = async (formData: FormData) => {
     setStatus("loading");
     setError("");

    try {
    const payload = {
      ...data,
      user_id: user?.id,
      email: user?.email
    };
 
     try {
       const response = await fetch(
         "https://tejanaidu7.app.n8n.cloud/webhook/overcome_limitation",
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
       
       // Map the response
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
 
       // Add any additional unknown fields dynamically
       Object.keys(data).forEach(key => {
         if (!(key in parsedData)) {
           parsedData[key] = data[key];
         }
       });
 
       setResultsData(parsedData);
       setStatus("success");
 
       // Save to database via edge function
       if (user?.email) {
         try {
           // Save material innovation data
           await supabase.functions.invoke('external-db', {
             body: {
               action: 'insert',
               table: 'material_innovation_data',
               data: {
                 user_id: user.id,
                 grade_name: formData.coreAsset,
                 redesign_data: parsedData,
                 created_at: new Date().toISOString(),
               }
             }
           });
 
           // Increment search count
           await supabase.functions.invoke('external-db', {
             body: {
               action: 'incrementSearchCount',
               email: user.email,
             }
           });
 
           toast({
             title: "Analysis Saved",
             description: "Your analysis has been saved to project history.",
           });
         } catch (dbError) {
           console.error('Database save error:', dbError);
         }
       }
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
         {/* Left Panel - Input */}
         <div>
           <InputPanel onSubmit={handleSubmit} isLoading={status === "loading"} />
         </div>
 
         {/* Right Panel - Results */}
         <div>
           <ResultsPanel status={status} data={resultsData} error={error} />
         </div>
       </div>
     </div>
   );
 }
