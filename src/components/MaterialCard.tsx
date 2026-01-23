import { motion } from "framer-motion";
import { TrendingUp, Zap, Shield, DollarSign } from "lucide-react";

interface MaterialCardProps {
  material: {
    name: string;
    advantage: string;
    performanceDelta: number;
    properties?: {
      tensileStrength?: number;
      thermalResistance?: number;
      costEfficiency?: number;
      durability?: number;
    };
  };
  index: number;
}

export function MaterialCard({ material, index }: MaterialCardProps) {
  const properties = material.properties || {};

  const propertyItems = [
    { 
      label: "Tensile Strength", 
      value: properties.tensileStrength ?? 0, 
      icon: TrendingUp,
      color: "from-cyan-400 to-blue-500"
    },
    { 
      label: "Thermal Resistance", 
      value: properties.thermalResistance ?? 0, 
      icon: Zap,
      color: "from-orange-400 to-red-500"
    },
    { 
      label: "Cost Efficiency", 
      value: properties.costEfficiency ?? 0, 
      icon: DollarSign,
      color: "from-green-400 to-emerald-500"
    },
    { 
      label: "Durability", 
      value: properties.durability ?? 0, 
      icon: Shield,
      color: "from-purple-400 to-pink-500"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className="glass-card p-5 hover:border-primary/40 transition-all duration-300 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-gradient transition-all">
            {material.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {material.advantage}
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">
            +{material.performanceDelta}%
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        {propertyItems.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
              <span className="text-foreground font-medium">{item.value}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className={`progress-fill bg-gradient-to-r ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}