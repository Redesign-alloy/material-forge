import { motion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";

interface MaterialProperties {
  name: string;
  density?: string;
  operatingTemp?: string;
  tensileStrength?: string;
}

interface ComparisonTableProps {
  oldMaterial?: MaterialProperties;
  newMaterial?: MaterialProperties;
  index: number;
}

export function ComparisonTable({ oldMaterial, newMaterial, index }: ComparisonTableProps) {
  if (!oldMaterial && !newMaterial) return null;

  const defaultOld: MaterialProperties = {
    name: oldMaterial?.name || "Current Material",
    density: oldMaterial?.density || "—",
    operatingTemp: oldMaterial?.operatingTemp || "—",
    tensileStrength: oldMaterial?.tensileStrength || "—",
  };

  const defaultNew: MaterialProperties = {
    name: newMaterial?.name || "Recommended Material",
    density: newMaterial?.density || "—",
    operatingTemp: newMaterial?.operatingTemp || "—",
    tensileStrength: newMaterial?.tensileStrength || "—",
  };

  const properties = [
    { label: "Density", old: defaultOld.density, new: defaultNew.density },
    { label: "Operating Temp", old: defaultOld.operatingTemp, new: defaultNew.operatingTemp },
    { label: "Tensile Strength", old: defaultOld.tensileStrength, new: defaultNew.tensileStrength },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="result-card"
    >
      <div className="section-title">
        <Scale className="w-5 h-5 text-primary" />
        <span>Property Comparison</span>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 sticky top-0 z-10">
              <th className="py-4 px-5 text-left font-semibold text-foreground text-base">Property</th>
              <th className="py-4 px-5 text-center font-semibold text-base">
                <span className="text-destructive">{defaultOld.name}</span>
              </th>
              <th className="py-4 px-5 text-center w-12">
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
              </th>
              <th className="py-4 px-5 text-center font-semibold text-base">
                <span className="text-success">{defaultNew.name}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop, i) => (
              <tr
                key={prop.label}
                className={`${i % 2 === 0 ? "bg-card" : "bg-muted/30"} border-t border-border/50`}
              >
                <td className="py-4 px-5 font-semibold text-foreground text-base">{prop.label}</td>
                <td className="py-4 px-5 text-center text-muted-foreground font-mono text-base">{prop.old}</td>
                <td className="py-4 px-5"></td>
                <td className="py-4 px-5 text-center text-foreground font-mono font-semibold text-base">{prop.new}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
