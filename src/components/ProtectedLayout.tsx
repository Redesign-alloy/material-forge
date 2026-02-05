 import { useEffect } from 'react';
 import { Outlet, useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { useAuth } from '@/contexts/AuthContext';
 import { AppSidebar } from '@/components/AppSidebar';
 import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
 import { Atom } from 'lucide-react';
 
 export function ProtectedLayout() {
   const { user, loading } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="flex flex-col items-center gap-4"
         >
           <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-pulse">
             <Atom className="w-10 h-10 text-primary" />
           </div>
           <p className="text-muted-foreground">Loading...</p>
         </motion.div>
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   return (
     <SidebarProvider defaultOpen={true}>
       <div className="min-h-screen flex w-full bg-background">
         <AppSidebar />
         <SidebarInset className="flex-1">
           <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4">
             <SidebarTrigger className="mr-4" />
             <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground font-medium font-mono">
                 Material Science Innovation Lab
               </span>
             </div>
           </header>
           <main className="p-6 lg:p-8">
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
             >
               <Outlet />
             </motion.div>
           </main>
         </SidebarInset>
       </div>
     </SidebarProvider>
   );
 }