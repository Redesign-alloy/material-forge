import { motion } from "framer-motion";
import { 
  Beaker, 
  Gauge, 
  Flame, 
  Anchor, 
  Droplets, 
  Cog, 
  FlaskConical,
  Zap,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioData {
  coreAsset: string;
  operationalContext: string;
  constraint: string;
  targetRequirements: string[];
  complianceStandards: string;
}

interface Scenario {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  level: "foundational" | "intermediate" | "advanced";
  data: ScenarioData;
}

const SCENARIOS: Scenario[] = [
  // Foundational
  {
    id: "marine-bolts",
    title: "Marine Structural Bolts",
    shortTitle: "Marine Bolts",
    icon: <Anchor className="w-5 h-5" />,
    level: "foundational",
    data: {
      coreAsset: "High-strength structural fasteners for coastal bridge assembly",
      operationalContext: "Outdoor coastal environment, high humidity, salt spray, static loading",
      constraint: "Standard Grade 8.8 Carbon Steel showing heavy red rust and pitting",
      targetRequirements: ["Enhanced corrosion resistance", "800 MPa tensile strength"],
      complianceStandards: "IS 1367, IS 6745"
    }
  },
  {
    id: "pump-impeller",
    title: "Agricultural Pump Impeller",
    shortTitle: "Pump Impeller",
    icon: <Droplets className="w-5 h-5" />,
    level: "foundational",
    data: {
      coreAsset: "Centrifugal pump impeller for groundwater irrigation",
      operationalContext: "1450 RPM, continuous duty, high silt/sand content",
      constraint: "Grade FG 200 Cast Iron showing abrasive wear and cavitation pitting",
      targetRequirements: ["High surface hardness", "Cavitation resistance"],
      complianceStandards: "IS 5120, IS 210"
    }
  },
  // Intermediate
  {
    id: "exhaust-manifold",
    title: "Turbocharged Exhaust Manifold",
    shortTitle: "Exhaust Manifold",
    icon: <Flame className="w-5 h-5" />,
    level: "intermediate",
    data: {
      coreAsset: "Automotive exhaust manifold",
      operationalContext: "Cyclic thermal loading (25°C to 800°C) with heavy vibration",
      constraint: "Grade 409L Ferritic Stainless Steel showing thermal fatigue cracking and scaling",
      targetRequirements: ["Higher creep-rupture strength", "Lower CTE"],
      complianceStandards: "IS 6911, ASTM A240"
    }
  },
  {
    id: "industrial-gears",
    title: "Heavy-Duty Industrial Gears",
    shortTitle: "Industrial Gears",
    icon: <Cog className="w-5 h-5" />,
    level: "intermediate",
    data: {
      coreAsset: "Spur gears for mining conveyor gearboxes",
      operationalContext: "High torque, shock loading, boundary lubrication",
      constraint: "Through-hardened EN8 Carbon Steel showing spalling and tooth root breakage",
      targetRequirements: ["Case-hardened surface (>60 HRC)", "High-toughness core"],
      complianceStandards: "IS 4432, AGMA 908"
    }
  },
  // Advanced
  {
    id: "acid-agitator",
    title: "Sulfuric Acid Agitator Shaft",
    shortTitle: "Acid Agitator",
    icon: <FlaskConical className="w-5 h-5" />,
    level: "advanced",
    data: {
      coreAsset: "Agitator shaft for pressurized leaching tank",
      operationalContext: "70% H2SO4, 150°C, 5 bar pressure",
      constraint: "316L Stainless Steel failing due to chloride-induced Stress Corrosion Cracking (SCC)",
      targetRequirements: ["Absolute SCC resistance in acidic environments", "High torsional rigidity"],
      complianceStandards: "IS 2825, NACE MR0175"
    }
  },
  {
    id: "turbine-blade",
    title: "High-Pressure Turbine Blade",
    shortTitle: "Turbine Blade",
    icon: <Zap className="w-5 h-5" />,
    level: "advanced",
    data: {
      coreAsset: "First-stage Gas Turbine Blade (Hot Section)",
      operationalContext: "1150°C, centrifugal stress > 200 MPa, oxidizing atmosphere",
      constraint: "Polycrystalline Nickel-base superalloy exhibiting creep strain and Gamma-prime Rafting",
      targetRequirements: ["Single-crystal (SX) structure", "Coherent Gamma-prime precipitates"],
      complianceStandards: "AMS 5401, ASTM E139"
    }
  }
];

const LEVEL_CONFIG = {
  foundational: {
    label: "Foundational",
    bgClass: "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50",
    iconClass: "text-emerald-500",
    badgeClass: "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
  },
  intermediate: {
    label: "Intermediate",
    bgClass: "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50",
    iconClass: "text-amber-500",
    badgeClass: "bg-amber-500/20 text-amber-600 border-amber-500/30"
  },
  advanced: {
    label: "Advanced",
    bgClass: "bg-rose-500/10 border-rose-500/30 hover:border-rose-500/50",
    iconClass: "text-rose-500",
    badgeClass: "bg-rose-500/20 text-rose-600 border-rose-500/30"
  }
};

interface QuickTestScenariosProps {
  onSelectScenario: (data: ScenarioData) => void;
  onClearForm: () => void;
}

export function QuickTestScenarios({ onSelectScenario, onClearForm }: QuickTestScenariosProps) {
  const foundational = SCENARIOS.filter(s => s.level === "foundational");
  const intermediate = SCENARIOS.filter(s => s.level === "intermediate");
  const advanced = SCENARIOS.filter(s => s.level === "advanced");

  const renderScenarioCard = (scenario: Scenario, index: number) => {
    const config = LEVEL_CONFIG[scenario.level];
    
    return (
      <motion.button
        key={scenario.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        onClick={() => onSelectScenario(scenario.data)}
        className={cn(
          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
          config.bgClass
        )}
      >
        <div className={cn("p-2.5 rounded-lg bg-background/50", config.iconClass)}>
          {scenario.icon}
        </div>
        <span className="text-sm font-medium text-foreground text-center leading-tight">
          {scenario.shortTitle}
        </span>
      </motion.button>
    );
  };

  const renderLevelSection = (
    level: "foundational" | "intermediate" | "advanced",
    scenarios: Scenario[],
    startIndex: number
  ) => {
    const config = LEVEL_CONFIG[level];
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full border",
            config.badgeClass
          )}>
            {config.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {scenarios.map((scenario, idx) => renderScenarioCard(scenario, startIndex + idx))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-6 lg:p-8 mb-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Beaker className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Quick Test Scenarios</h3>
            <p className="text-sm text-muted-foreground">Select a scenario to auto-fill the form</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearForm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border 
                     bg-background hover:bg-muted transition-colors text-sm font-medium text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Form
        </motion.button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {renderLevelSection("foundational", foundational, 0)}
        {renderLevelSection("intermediate", intermediate, 2)}
        {renderLevelSection("advanced", advanced, 4)}
      </div>
    </motion.div>
  );
}
