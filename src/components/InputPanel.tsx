import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  Box, 
  Settings, 
  AlertTriangle, 
  Target, 
  FileCheck,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormData {
  coreAsset: string;
  operationalContext: string;
  constraint: string;
  targetRequirements: string[];
  complianceStandards: string;
}

interface InputPanelProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const REQUIREMENT_SUGGESTIONS = [
  "Tensile Strength",
  "Thermal Resistance",
  "Weight Reduction",
  "Cost Efficiency",
  "Corrosion Resistance",
  "Fatigue Life",
  "Impact Resistance",
  "Chemical Resistance",
  "Electrical Conductivity",
  "Dimensional Stability",
];

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [formData, setFormData] = useState<FormData>({
    coreAsset: "",
    operationalContext: "",
    constraint: "",
    targetRequirements: [],
    complianceStandards: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel p-6 lg:p-8 h-full overflow-auto"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Material Analysis Parameters
        </h2>
        <p className="text-muted-foreground text-sm">
          Define your engineering constraints for AI-powered material recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Asset */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-primary" />
            <label className="label-text">Core Asset</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Enter the product name or equipment that requires material development</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={formData.coreAsset}
            onChange={(e) => updateField("coreAsset", e.target.value)}
            placeholder="e.g., Turbine Blade, Heat Exchanger, Structural Beam"
            className="input-field"
          />
        </div>

        {/* Operational Context */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <label className="label-text">Operational Context</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Describe the exact application and operating conditions including temperature, pressure, and chemical exposure</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            value={formData.operationalContext}
            onChange={(e) => updateField("operationalContext", e.target.value)}
            placeholder="e.g., Operating at 850°C in oxidizing atmosphere, exposed to sulfuric acid vapor, cyclic thermal loading between 200°C and 900°C..."
            className="input-field min-h-[100px] resize-none"
          />
        </div>

        {/* Critical Constraint */}
        <div className="space-y-2 critical-section py-4 -ml-4 pl-8">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <label className="label-text text-warning">Current Material Failure</label>
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning border border-warning/30">
              Critical
            </span>
          </div>
          <p className="tooltip-text mb-2">
            Describe why the current material is failing or underperforming
          </p>
          <Textarea
            value={formData.constraint}
            onChange={(e) => updateField("constraint", e.target.value)}
            placeholder="e.g., Current aluminum alloy experiencing creep deformation after 2000 hours, stress corrosion cracking at weld joints, thermal fatigue causing micro-fractures..."
            className="input-field min-h-[100px] resize-none border-warning/30 focus:border-warning/50"
          />
        </div>

        {/* Target Requirements */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <label className="label-text">Required Improvements</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Select or type the key improvements needed for your application</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <TagInput
            tags={formData.targetRequirements}
            onTagsChange={(tags) => updateField("targetRequirements", tags)}
            placeholder="Type or select improvements..."
            suggestions={REQUIREMENT_SUGGESTIONS}
          />
        </div>

        {/* Compliance Standards */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" />
            <label className="label-text">Industry Standards</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Specify required compliance standards (ISO, ASTM, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={formData.complianceStandards}
            onChange={(e) => updateField("complianceStandards", e.target.value)}
            placeholder="e.g., ISO 9001, ASTM E8, AMS 5643, ASME Section VIII"
            className="input-field"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
        <button
            type="submit"
            disabled={isLoading}
            className="w-full relative py-4 px-8 rounded-xl font-semibold text-lg 
                       bg-foreground text-background
                       glow-button disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 hover:opacity-90 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Zap className="w-5 h-5" />
              {isLoading ? "Processing..." : "Unleash & Ignite"}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
