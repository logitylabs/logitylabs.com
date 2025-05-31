/**
 * Supabase Configuration
 * Location: frontend/web/src/config/supabase.js
 * Purpose: Initialize Supabase client for database operations (waitlist signups)
 */

import { createClient } from "@supabase/supabase-js";

// Debug: Log all environment variables that Vite can see
console.log("🔍 DEBUG: All Vite environment variables:", import.meta.env);
console.log("🔍 DEBUG: VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "🔍 DEBUG: VITE_SUPABASE_ANON_KEY:",
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are configured
let supabase = null;

if (!supabaseUrl || supabaseUrl === "your_supabase_project_url_here") {
  console.warn(
    "⚠️ VITE_SUPABASE_URL not configured. Please set up your .env.local file."
  );
} else if (!supabaseKey || supabaseKey === "your_supabase_anon_key_here") {
  console.warn(
    "⚠️ VITE_SUPABASE_ANON_KEY not configured. Please set up your .env.local file."
  );
} else {
  // Create Supabase client only if both credentials are properly configured
  console.log("✅ Creating Supabase client with URL:", supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Export supabase client (may be null if not configured)
export { supabase };

// Helper function to test connection
export const testConnection = async () => {
  if (!supabase) {
    console.error(
      "❌ Supabase client not initialized. Check your environment variables."
    );
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("waitlist")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }

    console.log("Supabase connection successful");
    return true;
  } catch (err) {
    console.error("Supabase connection error:", err);
    return false;
  }
};
