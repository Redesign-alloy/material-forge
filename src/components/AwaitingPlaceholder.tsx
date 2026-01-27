import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

export function AwaitingPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 lg:py-32 text-center"
    >
      <div className="relative mb-8">
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
          className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-muted border border-border flex items-center justify-center"
        >
          <FlaskConical className="w-14 h-14 lg:w-16 lg:h-16 text-muted-foreground" />
        </motion.div>
      </div>
      
      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3">
        Awaiting Analysis...
      </h3>
      <p className="text-base lg:text-lg text-muted-foreground max-w-sm">
        Enter your material parameters and click "Unleash & Ignite" to generate AI-powered recommendations
      </p>
    </motion.div>
  );
}
