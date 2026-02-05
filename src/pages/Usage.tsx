 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { BarChart3, Zap, TrendingUp, Activity, Sparkles } from 'lucide-react';
 import { useAuth } from '@/contexts/AuthContext';
 import { supabase } from '@/integrations/supabase/client';
 
 export default function Usage() {
   const [searchCount, setSearchCount] = useState<number>(0);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();
 
   useEffect(() => {
     const fetchUsage = async () => {
       if (!user?.email) return;
       
       try {
         const { data, error } = await supabase.functions.invoke('external-db', {
           body: {
             action: 'select',
             table: 'user_data',
             filters: {
               email: user.email,
             }
           }
         });
 
         if (error) throw error;
         
         if (data?.data && data.data.length > 0) {
           setSearchCount(data.data[0].search_count || 0);
         }
       } catch (err) {
         console.error('Failed to fetch usage:', err);
       } finally {
         setLoading(false);
       }
     };
 
     fetchUsage();
   }, [user]);
 
   const stats = [
     {
       title: 'Total Analyses',
       value: searchCount,
       icon: Zap,
       color: 'primary',
       description: 'Lifetime material analyses performed',
     },
     {
       title: 'This Month',
       value: Math.min(searchCount, 30),
       icon: TrendingUp,
       color: 'success',
       description: 'Analyses in current billing period',
     },
     {
       title: 'Remaining Credits',
       value: Math.max(0, 100 - searchCount),
       icon: Activity,
       color: 'warning',
       description: 'Available analyses this month',
     },
   ];
 
   return (
     <div className="max-w-5xl mx-auto">
       <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
       >
         <div className="flex items-center gap-3 mb-2">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
             <BarChart3 className="w-5 h-5 text-primary" />
           </div>
           <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
             Usage Dashboard
           </h1>
         </div>
         <p className="text-muted-foreground">
           Track your analysis usage and remaining credits
         </p>
       </motion.div>
 
       {/* Stats Grid */}
       <div className="grid md:grid-cols-3 gap-6 mb-8">
         {stats.map((stat, index) => (
           <motion.div
             key={stat.title}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
             className="glass-panel p-6 hover:border-primary/30 transition-all duration-300"
           >
             <div className="flex items-start justify-between mb-4">
               <div className={`p-3 rounded-xl ${
                 stat.color === 'primary' ? 'bg-primary/10 border-primary/20' :
                 stat.color === 'success' ? 'bg-success/10 border-success/20' :
                 'bg-warning/10 border-warning/20'
               } border`}>
                 <stat.icon className={`w-6 h-6 ${
                   stat.color === 'primary' ? 'text-primary' :
                   stat.color === 'success' ? 'text-success' :
                   'text-warning'
                 }`} />
               </div>
             </div>
             <div className="mb-2">
               <span className="text-4xl font-bold text-foreground font-mono">
                 {loading ? '...' : stat.value.toLocaleString()}
               </span>
             </div>
             <h3 className="text-lg font-semibold text-foreground mb-1">{stat.title}</h3>
             <p className="text-sm text-muted-foreground">{stat.description}</p>
           </motion.div>
         ))}
       </div>
 
       {/* Progress Visualization */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3 }}
         className="glass-panel p-8"
       >
         <div className="flex items-center gap-3 mb-6">
           <Sparkles className="w-5 h-5 text-primary" />
           <h2 className="text-xl font-bold text-foreground">Monthly Usage</h2>
         </div>
         
         <div className="mb-6">
           <div className="flex items-center justify-between mb-3">
             <span className="text-sm font-medium text-muted-foreground">Credits Used</span>
             <span className="text-sm font-mono text-foreground">
               {loading ? '...' : `${searchCount} / 100`}
             </span>
           </div>
           <div className="h-4 bg-muted rounded-full overflow-hidden">
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${Math.min(100, searchCount)}%` }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-full rounded-full"
               style={{
                 background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--glow-blue)))`,
               }}
             />
           </div>
         </div>
 
         {/* Usage Gauge */}
         <div className="flex items-center justify-center py-8">
           <div className="relative">
             <svg className="w-48 h-48 transform -rotate-90">
               <circle
                 cx="96"
                 cy="96"
                 r="80"
                 fill="none"
                 stroke="hsl(var(--muted))"
                 strokeWidth="12"
               />
               <motion.circle
                 cx="96"
                 cy="96"
                 r="80"
                 fill="none"
                 stroke="hsl(var(--primary))"
                 strokeWidth="12"
                 strokeLinecap="round"
                 strokeDasharray={502.65}
                 initial={{ strokeDashoffset: 502.65 }}
                 animate={{ 
                   strokeDashoffset: 502.65 - (502.65 * Math.min(100, searchCount)) / 100 
                 }}
                 transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-4xl font-bold text-foreground font-mono">
                 {loading ? '...' : `${Math.min(100, searchCount)}%`}
               </span>
               <span className="text-sm text-muted-foreground">Used</span>
             </div>
           </div>
         </div>
 
         <div className="text-center text-sm text-muted-foreground">
           <p>Your usage resets on the 1st of each month.</p>
           <p className="mt-1">Need more credits? <a href="#" className="text-primary hover:underline">Upgrade your plan</a></p>
         </div>
       </motion.div>
     </div>
   );
 }