-- To copy paste into Supabase SQL Editor
-- Supabase Database Setup for Logity Waitlist
-- Location: frontend/web/supabase-setup-safe.sql
-- Purpose: Create waitlist table and setup Row Level Security (RLS) - handles existing objects

-- Drop existing objects first to ensure clean setup
DROP POLICY IF EXISTS "Allow public waitlist signup" ON public.waitlist;
DROP POLICY IF EXISTS "Allow public to read waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Prevent public updates" ON public.waitlist;
DROP POLICY IF EXISTS "Prevent public deletes" ON public.waitlist;
DROP TRIGGER IF EXISTS handle_waitlist_updated_at ON public.waitlist;
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Create waitlist table (recreate if exists)
CREATE TABLE IF NOT EXISTS public.waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    source text DEFAULT 'unknown',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes (drop first if they exist)
DROP INDEX IF EXISTS public.waitlist_email_idx;
DROP INDEX IF EXISTS public.waitlist_created_at_idx;
DROP INDEX IF EXISTS public.waitlist_source_idx;

CREATE INDEX waitlist_email_idx ON public.waitlist(email);
CREATE INDEX waitlist_created_at_idx ON public.waitlist(created_at DESC);
CREATE INDEX waitlist_source_idx ON public.waitlist(source);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies (fresh ones since we dropped existing)
CREATE POLICY "Allow public waitlist signup" ON public.waitlist
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public to read waitlist entries" ON public.waitlist
    FOR SELECT 
    USING (true);

CREATE POLICY "Prevent public updates" ON public.waitlist
    FOR UPDATE 
    USING (false);

CREATE POLICY "Prevent public deletes" ON public.waitlist
    FOR DELETE 
    USING (false);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER handle_waitlist_updated_at
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions to anon users for the waitlist table
GRANT SELECT, INSERT ON public.waitlist TO anon;

-- Insert a test entry to verify the table works (replace if exists)
INSERT INTO public.waitlist (email, source) 
VALUES ('test@logity.ai', 'test-setup')
ON CONFLICT (email) DO UPDATE SET 
    source = EXCLUDED.source,
    updated_at = timezone('utc'::text, now());

-- Comments for documentation
COMMENT ON TABLE public.waitlist IS 'Stores email addresses of users who signed up for the Logity waitlist';
COMMENT ON COLUMN public.waitlist.id IS 'Unique identifier for each waitlist entry';
COMMENT ON COLUMN public.waitlist.email IS 'User email address (unique)';
COMMENT ON COLUMN public.waitlist.source IS 'Source of signup (e.g., hero-button, nav-button, cta-button)';
COMMENT ON COLUMN public.waitlist.created_at IS 'Timestamp when user joined waitlist';
COMMENT ON COLUMN public.waitlist.updated_at IS 'Timestamp when record was last updated';

-- Success message
SELECT 'Waitlist table setup completed successfully! Ready to collect emails.' as setup_status; 