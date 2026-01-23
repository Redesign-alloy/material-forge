import { motion } from "framer-motion";
import { Atom } from "lucide-react";

export function AwaitingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="relative p-6 rounded-full border border-primary/30 bg-card/50">
          <Atom className="w-12 h-12 text-primary" />
        </div>
      </motion.div>
      
      <motion.h3
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xl font-medium text-muted-foreground mb-2"
      >
        Awaiting Analysis...
      </motion.h3>
      
      <p className="text-sm text-muted-foreground/70 text-center max-w-sm">
        Configure your material parameters and click "Unleash & Ignite" to receive AI-powered material recommendations.
      </p>
    </div>
  );
}