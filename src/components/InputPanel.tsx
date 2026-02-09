import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  Box, 
  Settings, 
  AlertTriangle, 
  Target, 
  FileCheck,
  Zap,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuickTestScenarios } from "./QuickTestScenarios";

export interface FormData {
  coreAsset: string;
  operationalContext: string;
  constraint: string;
  targetRequirements: string[];
  complianceStandards: string;
  maxPriceIncrement: number;
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

const EMPTY_FORM: FormData = {
  coreAsset: "",
  operationalContext: "",
  constraint: "",
  targetRequirements: [],
  complianceStandards: "",
  maxPriceIncrement: 50,
};

export function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectScenario = (data: Omit<FormData, 'maxPriceIncrement'>) => {
    setFormData({ ...data, maxPriceIncrement: formData.maxPriceIncrement });
  };

  const handleClearForm = () => {
    setFormData(EMPTY_FORM);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full overflow-auto space-y-6"
    >
      <QuickTestScenarios 
        onSelectScenario={handleSelectScenario}
        onClearForm={handleClearForm}
      />

      <div className="glass-panel p-8 lg:p-10">
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Material Analysis Parameters
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg">
            Define your engineering constraints for AI-powered material recommendations
          </p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Asset */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-primary" />
            <label className="text-base lg:text-lg font-medium text-foreground">Core Asset</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Enter the product name or equipment that requires material development</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={formData.coreAsset}
            onChange={(e) => updateField("coreAsset", e.target.value)}
            placeholder="e.g., Turbine Blade, Heat Exchanger, Structural Beam"
            className="input-field text-base lg:text-lg h-12 lg:h-14"
          />
        </div>

        {/* Operational Context */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <label className="text-base lg:text-lg font-medium text-foreground">Operational Context</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Describe the exact application and operating conditions including temperature, pressure, and chemical exposure</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            value={formData.operationalContext}
            onChange={(e) => updateField("operationalContext", e.target.value)}
            placeholder="e.g., Operating at 850°C in oxidizing atmosphere, exposed to sulfuric acid vapor, cyclic thermal loading between 200°C and 900°C..."
            className="input-field min-h-[120px] lg:min-h-[140px] resize-none text-base lg:text-lg"
          />
        </div>

        {/* Critical Constraint */}
        <div className="space-y-3 critical-section py-6 -ml-4 pl-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <label className="text-base lg:text-lg font-medium text-warning">Current Material Failure</label>
            <span className="text-sm px-3 py-1 rounded-full bg-warning/20 text-warning border border-warning/30 font-medium">
              Critical
            </span>
          </div>
          <p className="text-sm lg:text-base text-muted-foreground mb-3">
            Describe why the current material is failing or underperforming
          </p>
          <Textarea
            value={formData.constraint}
            onChange={(e) => updateField("constraint", e.target.value)}
            placeholder="e.g., Current aluminum alloy experiencing creep deformation after 2000 hours, stress corrosion cracking at weld joints, thermal fatigue causing micro-fractures..."
            className="input-field min-h-[120px] lg:min-h-[140px] resize-none border-warning/30 focus:border-warning/50 text-base lg:text-lg"
          />
        </div>

        {/* Target Requirements */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <label className="text-base lg:text-lg font-medium text-foreground">Required Improvements</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Select or type the key improvements needed for your application</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <TagInput
            tags={formData.targetRequirements}
            onTagsChange={(tags) => updateField("targetRequirements", tags)}
            placeholder="Type or select improvements..."
            suggestions={REQUIREMENT_SUGGESTIONS}
            className="text-base lg:text-lg"
          />
        </div>

        {/* Compliance Standards */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-primary" />
            <label className="text-base lg:text-lg font-medium text-foreground">Industry Standards</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Specify required compliance standards (ISO, ASTM, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            value={formData.complianceStandards}
            onChange={(e) => updateField("complianceStandards", e.target.value)}
            placeholder="e.g., ISO 9001, ASTM E8, AMS 5643, ASME Section VIII"
            className="input-field text-base lg:text-lg h-12 lg:h-14"
          />
        </div>

        {/* Economic Constraints - Max Price Increment */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <label className="text-base lg:text-lg font-medium text-foreground">Economic Constraints</label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Maximum allowable increase in material cost compared to the current failed material.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-y-3 bg-muted/30 border border-border rounded-lg p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Max Price Increment (%)</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={500}
                  value={formData.maxPriceIncrement}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(500, Number(e.target.value) || 0));
                    updateField("maxPriceIncrement", val);
                  }}
                  className="w-24 h-9 text-center font-mono text-sm input-field"
                />
                <span className="text-sm text-muted-foreground font-medium">%</span>
              </div>
            </div>
            <Slider
              value={[formData.maxPriceIncrement]}
              onValueChange={(v) => updateField("maxPriceIncrement", v[0])}
              min={0}
              max={500}
              step={5}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
              <span>250%</span>
              <span>500%+</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative py-5 px-10 rounded-xl font-bold text-lg lg:text-xl 
                       bg-gradient-to-r from-primary to-primary/80 text-primary-foreground
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-shadow duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Zap className="w-6 h-6" />
              {isLoading ? "Processing..." : "Unleash & Ignite"}
            </span>
          </motion.button>
        </div>
      </form>
      </div>
    </motion.div>
  );
}
