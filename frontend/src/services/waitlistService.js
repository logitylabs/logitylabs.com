/**
 * Waitlist Service
 * Location: frontend/web/src/services/waitlistService.js
 * Purpose: Handle waitlist email submissions to Supabase
 */

// Supabase client will be loaded dynamically
let supabase = null;

/**
 * Load Supabase client dynamically based on environment
 */
async function loadSupabase() {
  if (supabase) return supabase; // Already loaded

  try {
    // Try to load development config first
    const { supabase: devSupabase } = await import("../config/supabase.js");
    supabase = devSupabase;
    console.log("✅ Loaded development Supabase client");
    return supabase;
  } catch (error) {
    console.log("🔄 Development config failed, trying CDN version...");
    try {
      // Fallback to CDN version for production
      const { supabase: cdnSupabase } = await import(
        "../config/supabase-cdn.js"
      );
      supabase = cdnSupabase;
      console.log("✅ Loaded CDN Supabase client");
      return supabase;
    } catch (cdnError) {
      console.error("❌ Both Supabase configs failed:", error, cdnError);
      return null;
    }
  }
}

/**
 * Add an email to the waitlist
 * @param {string} email - User's email address
 * @param {string} source - Source of the signup (e.g., 'hero-button', 'nav-button')
 * @returns {Promise<{success: boolean, error?: string, data?: object}>}
 */
export async function addToWaitlist(email, source = "unknown") {
  try {
    // Input validation
    if (!email || typeof email !== "string") {
      return {
        success: false,
        error: "Email is required",
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Log analytics (console for now, could be enhanced with proper analytics)
    console.log("Waitlist signup attempt:", {
      email: email.substring(0, 3) + "***",
      source,
      timestamp: new Date().toISOString(),
    });

    // Load Supabase client dynamically
    const supabaseClient = await loadSupabase();

    // Check if Supabase is configured
    if (!supabaseClient) {
      console.warn("Supabase not configured - would save:", { email, source });
      return {
        success: false,
        error: "Service temporarily unavailable. Please try again later.",
      };
    }

    // Insert email into waitlist table
    const { data, error } = await supabaseClient
      .from("waitlist")
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: source,
        },
      ])
      .select(); // Return the inserted data

    if (error) {
      // Handle unique constraint violation (email already exists)
      if (
        error.code === "23505" &&
        error.message.includes("waitlist_email_key")
      ) {
        console.log("Duplicate signup attempt:", {
          email: email.substring(0, 3) + "***",
          source,
        });
        return {
          success: false,
          error: "You're already on the waitlist! We'll be in touch soon.",
        };
      }

      // Log other errors for debugging
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }

    // Success! Log analytics
    console.log("Waitlist signup success:", {
      email: email.substring(0, 3) + "***",
      source,
      id: data[0]?.id,
    });

    return {
      success: true,
      data: data[0],
    };
  } catch (error) {
    console.error("Unexpected error in addToWaitlist:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}

/**
 * Get waitlist statistics (for admin use)
 * @returns {Promise<{total: number, sources: object, recent: number}>}
 */
export async function getWaitlistStats() {
  try {
    // Load Supabase client dynamically
    const supabaseClient = await loadSupabase();

    if (!supabaseClient) {
      console.warn("Supabase not configured");
      return { total: 0, sources: {}, recent: 0 };
    }

    // Get total count
    const { count: total } = await supabaseClient
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    // Get source breakdown
    const { data: sourceData } = await supabaseClient
      .from("waitlist")
      .select("source")
      .neq("source", null);

    const sources = {};
    sourceData?.forEach((item) => {
      sources[item.source] = (sources[item.source] || 0) + 1;
    });

    // Get recent signups (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recent } = await supabaseClient
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    return {
      total: total || 0,
      sources,
      recent: recent || 0,
    };
  } catch (error) {
    console.error("Error getting waitlist stats:", error);
    return { total: 0, sources: {}, recent: 0 };
  }
}
