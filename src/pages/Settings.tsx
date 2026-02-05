 import { useState } from 'react';
 import { motion } from 'framer-motion';
 import { Settings as SettingsIcon, User, Lock, Mail, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { useAuth } from '@/contexts/AuthContext';
 import { useToast } from '@/hooks/use-toast';
 import { z } from 'zod';
 
 const passwordSchema = z.object({
   newPassword: z.string().min(6, 'Password must be at least 6 characters'),
   confirmPassword: z.string(),
 }).refine(data => data.newPassword === data.confirmPassword, {
   message: "Passwords don't match",
   path: ['confirmPassword'],
 });
 
 export default function Settings() {
   const { user, updatePassword } = useAuth();
   const { toast } = useToast();
   
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
 
   const handlePasswordUpdate = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors({});
     
     try {
       passwordSchema.parse({ newPassword, confirmPassword });
     } catch (e) {
       if (e instanceof z.ZodError) {
         const errs: typeof errors = {};
         e.errors.forEach(err => {
           if (err.path[0] === 'newPassword') errs.newPassword = err.message;
           if (err.path[0] === 'confirmPassword') errs.confirmPassword = err.message;
         });
         setErrors(errs);
         return;
       }
     }
     
     setLoading(true);
     
     try {
       const result = await updatePassword(newPassword);
       
       if (result.error) {
         toast({
           title: "Error",
           description: result.error,
           variant: "destructive",
         });
       } else {
         toast({
           title: "Password Updated",
           description: "Your password has been successfully changed.",
         });
         setNewPassword('');
         setConfirmPassword('');
       }
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="max-w-3xl mx-auto">
       <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         className="mb-8"
       >
         <div className="flex items-center gap-3 mb-2">
           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
             <SettingsIcon className="w-5 h-5 text-primary" />
           </div>
           <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
             Settings
           </h1>
         </div>
         <p className="text-muted-foreground">
           Manage your account and security preferences
         </p>
       </motion.div>
 
       {/* Account Information */}
       <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1 }}
         className="glass-panel p-6 mb-6"
       >
         <div className="flex items-center gap-3 mb-6">
           <User className="w-5 h-5 text-primary" />
           <h2 className="text-lg font-semibold text-foreground">Account Information</h2>
         </div>
         
         <div className="space-y-4">
           <div>
             <label className="text-sm font-medium text-muted-foreground mb-2 block">Email Address</label>
             <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
               <Mail className="w-5 h-5 text-muted-foreground" />
               <span className="font-mono text-foreground">{user?.email || 'Not available'}</span>
               <Check className="w-5 h-5 text-success ml-auto" />
             </div>
           </div>
           
           <div>
             <label className="text-sm font-medium text-muted-foreground mb-2 block">User ID</label>
             <div className="p-4 rounded-lg bg-muted/50 border border-border">
               <span className="font-mono text-sm text-muted-foreground">{user?.id || 'Not available'}</span>
             </div>
           </div>
         </div>
       </motion.div>
 
       {/* Security */}
       <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="glass-panel p-6"
       >
         <div className="flex items-center gap-3 mb-6">
           <Lock className="w-5 h-5 text-primary" />
           <h2 className="text-lg font-semibold text-foreground">Security</h2>
         </div>
         
         <form onSubmit={handlePasswordUpdate} className="space-y-5">
           <div>
             <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <Input
                 type={showPassword ? 'text' : 'password'}
                 value={newPassword}
                 onChange={(e) => setNewPassword(e.target.value)}
                 placeholder="Enter new password"
                 className="pl-11 pr-11 h-12 input-field"
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
               >
                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
               </button>
             </div>
             {errors.newPassword && (
               <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                 <AlertCircle className="w-4 h-4" />
                 {errors.newPassword}
               </p>
             )}
           </div>
           
           <div>
             <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <Input
                 type={showPassword ? 'text' : 'password'}
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 placeholder="Confirm new password"
                 className="pl-11 h-12 input-field"
               />
             </div>
             {errors.confirmPassword && (
               <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                 <AlertCircle className="w-4 h-4" />
                 {errors.confirmPassword}
               </p>
             )}
           </div>
           
           <Button
             type="submit"
             disabled={loading || !newPassword || !confirmPassword}
             className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
           >
             {loading ? 'Updating...' : 'Update Password'}
           </Button>
         </form>
       </motion.div>
     </div>
   );
 }