import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

export function AwaitingPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center"
        >
          <FlaskConical className="w-10 h-10 text-muted-foreground" />
        </motion.div>
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-2">
        Awaiting Analysis...
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Enter your material parameters and click "Unleash & Ignite" to generate AI-powered recommendations
      </p>
    </motion.div>
  );
}
