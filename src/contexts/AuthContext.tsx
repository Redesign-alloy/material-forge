 import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { User, Session } from '@supabase/supabase-js';
 
 interface AuthContextType {
   user: User | null;
   session: Session | null;
   loading: boolean;
   signUp: (email: string, password: string) => Promise<{ error: string | null }>;
   signIn: (email: string, password: string) => Promise<{ error: string | null }>;
   signOut: () => Promise<void>;
   updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
 }
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);
 
   useEffect(() => {
     // Set up auth state listener FIRST
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       (event, session) => {
         setSession(session);
         setUser(session?.user ?? null);
         setLoading(false);
       }
     );
 
     // THEN check for existing session
     supabase.auth.getSession().then(({ data: { session } }) => {
       setSession(session);
       setUser(session?.user ?? null);
       setLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, []);
 
   const signUp = async (email: string, password: string) => {
     try {
       const { error } = await supabase.auth.signUp({
         email,
         password,
         options: {
           emailRedirectTo: `${window.location.origin}/`
         }
       });
       
       if (error) {
         if (error.message.includes('already registered')) {
           return { error: 'This email is already registered. Please sign in instead.' };
         }
         return { error: error.message };
       }
       
       return { error: null };
     } catch (e) {
       return { error: 'An unexpected error occurred' };
     }
   };
 
   const signIn = async (email: string, password: string) => {
     try {
       const { error } = await supabase.auth.signInWithPassword({ email, password });
       
       if (error) {
         if (error.message.includes('Invalid login credentials')) {
           return { error: 'Invalid email or password' };
         }
         return { error: error.message };
       }
       
       return { error: null };
     } catch (e) {
       return { error: 'An unexpected error occurred' };
     }
   };
 
   const signOut = async () => {
     await supabase.auth.signOut();
   };
 
   const updatePassword = async (newPassword: string) => {
     try {
       const { error } = await supabase.auth.updateUser({ password: newPassword });
       if (error) return { error: error.message };
       return { error: null };
     } catch (e) {
       return { error: 'An unexpected error occurred' };
     }
   };
 
   return (
     <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, updatePassword }}>
       {children}
     </AuthContext.Provider>
   );
 }
 
 export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
     throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
 }