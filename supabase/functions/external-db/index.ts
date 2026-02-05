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
     const { action, table, data, filters, userId, email } = await req.json();
     
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
       case "select": {
         let query = externalSupabase.from(table).select("*");
         if (filters?.user_id) {
           query = query.eq("user_id", filters.user_id);
         }
         if (filters?.email) {
           query = query.eq("email", filters.email);
         }
         if (filters?.orderBy) {
           query = query.order(filters.orderBy, { ascending: filters.ascending ?? false });
         }
         if (filters?.limit) {
           query = query.limit(filters.limit);
         }
         result = await query;
         break;
       }
       case "insert": {
         result = await externalSupabase.from(table).insert(data).select();
         break;
       }
       case "update": {
         let query = externalSupabase.from(table).update(data);
         if (filters?.id) {
           query = query.eq("id", filters.id);
         }
         if (filters?.email) {
           query = query.eq("email", filters.email);
         }
         if (filters?.user_id) {
           query = query.eq("user_id", filters.user_id);
         }
         result = await query.select();
         break;
       }
       case "upsert": {
         result = await externalSupabase.from(table).upsert(data, { onConflict: filters?.onConflict || "id" }).select();
         break;
       }
       case "incrementSearchCount": {
         // First get current count
         const { data: currentData } = await externalSupabase
           .from("user_data")
           .select("search_count")
           .eq("email", email)
           .single();
         
         const currentCount = currentData?.search_count || 0;
         
         // Upsert with incremented count
         result = await externalSupabase
           .from("user_data")
           .upsert({ 
             email, 
             search_count: currentCount + 1,
             updated_at: new Date().toISOString()
           }, { onConflict: "email" })
           .select();
         break;
       }
       default:
         return new Response(
           JSON.stringify({ error: "Invalid action" }),
           { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
         );
     }
 
     if (result.error) {
       console.error("DB error:", result.error);
       return new Response(
         JSON.stringify({ error: result.error.message }),
         { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
       );
     }
 
     return new Response(
       JSON.stringify({ data: result.data }),
       { headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   } catch (error) {
     console.error("External DB error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });