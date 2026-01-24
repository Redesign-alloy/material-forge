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
        <Scale className="w-5 h-5 text-glow-cyan" />
        <span>Property Comparison</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Property</th>
              <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                <span className="text-destructive/70">{defaultOld.name}</span>
              </th>
              <th className="py-3 px-4 text-center w-10">
                <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
              </th>
              <th className="py-3 px-4 text-center font-medium text-muted-foreground">
                <span className="text-success">{defaultNew.name}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop, i) => (
              <tr key={prop.label} className={i < properties.length - 1 ? "border-b border-border/50" : ""}>
                <td className="py-3 px-4 font-medium text-foreground">{prop.label}</td>
                <td className="py-3 px-4 text-center text-muted-foreground">{prop.old}</td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4 text-center text-foreground font-medium">{prop.new}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
