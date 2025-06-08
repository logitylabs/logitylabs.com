/**
 * Environment Configuration for Production
 * Location: frontend/src/config/env.js
 * Purpose: Set environment variables for production deployment
 *
 * Instructions:
 * 1. Replace the placeholder values with your actual Supabase credentials
 * 2. This file should be loaded before supabase.js in your HTML files
 */

// Production environment variables
// Use the values from .env.local for production deployment
window.VITE_SUPABASE_URL =
  window.VITE_SUPABASE_URL || "https://xtjbyojcsfdpblbtprwc.supabase.co";
window.VITE_SUPABASE_ANON_KEY =
  window.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0amJ5b2pjc2ZkcGJsYnRwcndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MjMyNDgsImV4cCI6MjA2NDA5OTI0OH0.PywY_MNxgkqLv7EghrBps1_htZaKIihiZZxoG42fA-w";

console.log("🔧 Environment configuration loaded");
