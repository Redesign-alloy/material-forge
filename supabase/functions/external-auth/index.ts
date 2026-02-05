 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { action, email, password, newPassword } = await req.json();
     
     const externalUrl = Deno.env.get("EXTERNAL_SUPABASE_URL");
     const externalKey = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY");
     
     if (!externalUrl || !externalKey) {
       return new Response(
         JSON.stringify({ error: "External Supabase not configured" }),
         { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
     
     const externalSupabase = createClient(externalUrl, externalKey);
 
     let result;
 
     switch (action) {
       case "signUp":
         result = await externalSupabase.auth.signUp({ email, password });
         break;
       case "signIn":
         result = await externalSupabase.auth.signInWithPassword({ email, password });
         break;
       case "signOut": {
         const signOutResult = await externalSupabase.auth.signOut();
         return new Response(
           JSON.stringify({ data: { success: !signOutResult.error } }),
           { headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       }
         break;
       case "updatePassword":
         result = await externalSupabase.auth.updateUser({ password: newPassword });
         break;
       case "getConfig":
         return new Response(
           JSON.stringify({ url: externalUrl, key: externalKey }),
           { headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
       default:
         return new Response(
           JSON.stringify({ error: "Invalid action" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
     }
 
     if (result?.error) {
       return new Response(
         JSON.stringify({ error: result.error.message }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ data: result?.data }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("External auth error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });