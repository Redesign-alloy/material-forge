 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { Atom, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { MolecularLattice } from '@/components/MolecularLattice';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { z } from 'zod';
 
 const authSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
 });
 
 export default function Auth() {
   const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
   
   const { signIn, signUp, user } = useAuth();
   const navigate = useNavigate();
   
   useEffect(() => {
     if (user) {
       navigate('/dashboard');
     }
   }, [user, navigate]);
 
   const validateForm = () => {
     try {
       authSchema.parse({ email, password });
       setValidationErrors({});
       return true;
     } catch (e) {
       if (e instanceof z.ZodError) {
         const errors: { email?: string; password?: string } = {};
         e.errors.forEach(err => {
           if (err.path[0] === 'email') errors.email = err.message;
           if (err.path[0] === 'password') errors.password = err.message;
         });
         setValidationErrors(errors);
       }
       return false;
     }
   };
   
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     
     if (!validateForm()) return;
     
     setLoading(true);
     
     try {
       const result = isLogin 
         ? await signIn(email, password)
         : await signUp(email, password);
       
       if (result.error) {
         setError(result.error);
       } else if (!isLogin) {
         // For signup, show success and switch to login
         setIsLogin(true);
         setError('');
       }
     } catch (e) {
       setError('An unexpected error occurred');
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen relative overflow-hidden">
       {/* Background */}
       <MolecularLattice />
       
       {/* Back Link */}
       <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         className="absolute top-6 left-6 z-20"
       >
         <Link
           to="/"
           className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
         >
           <ArrowLeft className="w-5 h-5" />
           <span>Back to Home</span>
         </Link>
       </motion.div>
       
       {/* Auth Card */}
       <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
         <motion.div
           initial={{ opacity: 0, y: 20, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md"
         >
           {/* Glassmorphism Card */}
           <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
             {/* Logo */}
             <div className="flex items-center justify-center gap-3 mb-8">
               <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                 <Atom className="w-7 h-7 text-primary" />
               </div>
               <span className="text-2xl font-bold text-white">MaterialAI</span>
             </div>
             
             {/* Title */}
             <div className="text-center mb-8">
               <h1 className="text-2xl font-bold text-white mb-2">
                 {isLogin ? 'Welcome Back' : 'Create Account'}
               </h1>
               <p className="text-white/60">
                 {isLogin 
                   ? 'Sign in to access your dashboard' 
                   : 'Start your material science journey'}
               </p>
             </div>
             
             {/* Error Message */}
             {error && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/20 border border-red-500/30"
               >
                 <AlertCircle className="w-5 h-5 text-red-400" />
                 <span className="text-sm text-red-300">{error}</span>
               </motion.div>
             )}
             
             {/* Form */}
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-white/80">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                   <Input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="you@example.com"
                     className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40
                                focus:border-primary/50 focus:ring-primary/30"
                   />
                 </div>
                 {validationErrors.email && (
                   <p className="text-xs text-red-400">{validationErrors.email}</p>
                 )}
               </div>
               
               <div className="space-y-2">
                 <label className="text-sm font-medium text-white/80">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                   <Input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="pl-11 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40
                                focus:border-primary/50 focus:ring-primary/30"
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                   >
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
                 {validationErrors.password && (
                   <p className="text-xs text-red-400">{validationErrors.password}</p>
                 )}
               </div>
               
               <Button
                 type="submit"
                 disabled={loading}
                 className="w-full h-12 bg-primary hover:bg-primary/90 text-slate-900 font-bold text-base"
               >
                 {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
               </Button>
             </form>
             
             {/* Toggle */}
             <div className="mt-6 text-center">
               <button
                 type="button"
                 onClick={() => {
                   setIsLogin(!isLogin);
                   setError('');
                   setValidationErrors({});
                 }}
                 className="text-sm text-white/60 hover:text-white transition-colors"
               >
                 {isLogin ? "Don't have an account? " : 'Already have an account? '}
                 <span className="text-primary font-medium">
                   {isLogin ? 'Sign Up' : 'Sign In'}
                 </span>
               </button>
             </div>
           </div>
         </motion.div>
       </div>
     </div>
   );
 }