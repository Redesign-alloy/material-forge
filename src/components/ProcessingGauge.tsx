import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { useEffect, useState } from "react";

interface ProcessingGaugeProps {
  isProcessing: boolean;
}

export function ProcessingGauge({ isProcessing }: ProcessingGaugeProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setElapsedTime(0);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      // Simulate progress that slows down as it approaches 100
      setProgress((prev) => {
        const remaining = 100 - prev;
        const increment = remaining * 0.08;
        return Math.min(prev + increment, 95);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center py-16"
    >
      {/* Icon with scanning animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Database className="w-10 h-10 text-primary" />
        </div>
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line" />
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Scanning Material Database...
        </h3>
        <p className="text-sm text-muted-foreground">
          Analyzing molecular structures and properties
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-glow-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm">Elapsed:</span>
        <span className="font-mono text-sm font-medium text-foreground">
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Processing Steps */}
      <div className="mt-8 space-y-2 text-sm text-muted-foreground">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: elapsedTime > 0 ? 1 : 0.5 }}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${elapsedTime > 0 ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          <span>Parsing input parameters</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: elapsedTime > 2 ? 1 : 0.5 }}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${elapsedTime > 2 ? 'bg-success' : 'bg-muted-foreground/30'}`} />
          <span>Querying material properties database</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: elapsedTime > 5 ? 1 : 0.5 }}
          className="flex items-center gap-2"
        >
          <div className={`w-2 h-2 rounded-full ${elapsedTime > 5 ? 'bg-primary' : 'bg-muted-foreground/30'} ${elapsedTime > 5 && progress < 95 ? 'animate-pulse' : ''}`} />
          <span>Running AI analysis engine</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
