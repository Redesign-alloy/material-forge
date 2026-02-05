 import { motion } from 'framer-motion';
 import { Atom, ArrowRight, Sparkles, Shield, Zap, Database } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { MolecularLattice } from '@/components/MolecularLattice';
 
 export default function Landing() {
   return (
     <div className="min-h-screen relative overflow-hidden">
       {/* Molecular Lattice Background */}
       <MolecularLattice />
       
       {/* Content Overlay */}
       <div className="relative z-10 min-h-screen flex flex-col">
         {/* Header */}
         <motion.header
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="px-6 lg:px-12 py-6"
         >
           <div className="max-w-7xl mx-auto flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-sm">
                 <Atom className="w-7 h-7 text-primary" />
               </div>
               <span className="text-xl font-bold text-white">MaterialAI</span>
             </div>
             
             <Link
               to="/auth"
               className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm
                          text-white font-medium hover:bg-white/20 transition-all duration-300"
             >
               Sign In
             </Link>
           </div>
         </motion.header>
         
         {/* Hero Section */}
         <main className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12">
           <div className="max-w-4xl mx-auto text-center">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-8">
                 <Sparkles className="w-4 h-4 text-primary" />
                 <span className="text-sm font-medium text-primary">AI-Powered Material Science</span>
               </div>
               
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                 Transform Material
                 <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-300">
                   Engineering Challenges
                 </span>
               </h1>
               
               <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                 Leverage AI to diagnose material failures, discover optimal replacements, 
                 and receive scientifically-backed recommendations in seconds.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link
                   to="/auth"
                   className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-slate-900 
                              font-bold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/30"
                 >
                   Get Started
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 
                 <a
                   href="#features"
                   className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold
                              hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                 >
                   Learn More
                 </a>
               </div>
             </motion.div>
           </div>
         </main>
         
         {/* Features Section */}
         <section id="features" className="px-6 lg:px-12 py-16">
           <div className="max-w-6xl mx-auto">
             <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="grid md:grid-cols-3 gap-6"
             >
               {[
                 {
                   icon: Zap,
                   title: 'Instant Analysis',
                   description: 'Get comprehensive material recommendations in seconds, not weeks.',
                 },
                 {
                   icon: Shield,
                   title: 'Industry Standards',
                   description: 'All suggestions comply with ISO, ASTM, and other industry standards.',
                 },
                 {
                   icon: Database,
                   title: 'Project History',
                   description: 'Track all your analyses and access previous recommendations anytime.',
                 },
               ].map((feature, index) => (
                 <motion.div
                   key={feature.title}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm
                              hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                 >
                   <div className="p-3 rounded-xl bg-primary/20 w-fit mb-4">
                     <feature.icon className="w-6 h-6 text-primary" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                   <p className="text-white/60">{feature.description}</p>
                 </motion.div>
               ))}
             </motion.div>
           </div>
         </section>
         
         {/* Footer */}
         <footer className="px-6 lg:px-12 py-8 border-t border-white/10">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-white/60">
               <Atom className="w-5 h-5 text-primary" />
               <span className="text-sm">© 2024 MaterialAI. All rights reserved.</span>
             </div>
             <div className="flex items-center gap-6">
               <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</a>
               <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms</a>
               <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a>
             </div>
           </div>
         </footer>
       </div>
     </div>
   );
 }