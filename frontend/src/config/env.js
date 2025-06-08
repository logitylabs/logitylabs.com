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
// TODO: Replace with your actual values before deployment
window.VITE_SUPABASE_URL =
  window.VITE_SUPABASE_URL || "https://your-project.supabase.co";
window.VITE_SUPABASE_ANON_KEY =
  window.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

// You can also set these directly:
// window.VITE_SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';
// window.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

console.log("🔧 Environment configuration loaded");
