/**
 * Supabase Configuration (CDN Version)
 * Location: frontend/src/config/supabase-cdn.js
 * Purpose: CDN-based Supabase client for production deployment
 *
 * This file is loaded when the ES6 import version fails in production
 */

// Use Supabase from CDN (loaded via script tag)
const { createClient } = window.supabase;

// Get environment variables from window object (set by env.js)
const supabaseUrl =
  window.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = window.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

console.log("🔍 DEBUG: CDN Supabase URL:", supabaseUrl);
console.log("🔍 DEBUG: CDN Supabase Key configured:", !!supabaseKey);

// Check if environment variables are configured
let supabase = null;

if (!supabaseUrl || supabaseUrl === "https://your-project.supabase.co") {
  console.warn(
    "⚠️ VITE_SUPABASE_URL not configured. Please set window.VITE_SUPABASE_URL in env.js."
  );
} else if (!supabaseKey || supabaseKey === "your-anon-key-here") {
  console.warn(
    "⚠️ VITE_SUPABASE_ANON_KEY not configured. Please set window.VITE_SUPABASE_ANON_KEY in env.js."
  );
} else {
  // Create Supabase client only if both credentials are properly configured
  console.log("✅ Creating CDN Supabase client with URL:", supabaseUrl);
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
