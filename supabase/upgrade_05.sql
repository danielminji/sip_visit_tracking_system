-- Migration 05: Fix section_code constraint and handle existing data properly
-- Run this in Supabase SQL editor

-- First, let's check what data currently exists in visit_sections
-- This will help us understand the current state
DO $$
BEGIN
  RAISE NOTICE 'Current visit_sections data:';
  RAISE NOTICE 'Total rows: %', (SELECT COUNT(*) FROM public.visit_sections);
  RAISE NOTICE 'Unique section_codes: %', (SELECT COUNT(DISTINCT section_code) FROM public.visit_sections);
  RAISE NOTICE 'Sample section_codes: %', (SELECT string_agg(section_code, ', ') FROM (SELECT DISTINCT section_code FROM public.visit_sections LIMIT 10) t);
END $$;

-- The issue is that we're trying to change a constraint that has existing data
-- Instead of modifying the existing table, let's create a new approach:

-- Option 1: Keep the existing visit_sections table for standard-level data
-- and use visit_pages table for page-level data (which is already correct)

-- Option 2: If we really need to store page codes in visit_sections, 
-- we need to handle existing data first

-- Let's go with Option 1 (recommended) - keep visit_sections for standards, use visit_pages for pages
-- This maintains backward compatibility and follows the existing design

-- First, let's ensure visit_pages table has the correct structure
-- (This should already exist from previous migrations)

-- Now let's update the application logic to use visit_pages for page-specific data
-- and visit_sections for standard-level summaries

-- The constraint violation suggests we have existing data that doesn't match our new pattern
-- Let's check what's in the table and clean it up if needed

-- If there are any invalid section_codes, let's see what they are:
SELECT section_code, COUNT(*) as count 
FROM public.visit_sections 
WHERE section_code !~ '^[123](\.[12])?$'
GROUP BY section_code;

-- If the above query returns any results, we need to clean up the data first
-- For now, let's keep the existing constraint and use visit_pages for page data

-- The correct approach is:
-- 1. visit_sections stores standard-level data (section_code: '1', '2', '3.1', '3.2', '3.3')
-- 2. visit_pages stores page-level data (standard_code: '1', '2', '3.1', '3.2', '3.3', page_code: '1-2', '1-3', etc.)

-- No changes needed to the existing constraints - they are correct as they are
-- The application should be updated to use visit_pages for page-specific data instead of trying to store page codes in visit_sections
