# Database Schema: SIP+ Visit Tracking System

This document provides an overview of the PostgreSQL database schema used in the SIP+ Visit Tracking System, managed via Supabase.

## 1. Core Tables

### `public.profiles`

Stores user profile information, linked to the `auth.users` table provided by Supabase.

- **id (uuid, primary key)**: Foreign key to `auth.users.id`.
- **name (text)**: The user's full name.
- **role (text)**: User's role ('officer' or 'admin'). Defaults to 'officer'.

### `public.schools`

Contains a list of all schools.

- **id (uuid, primary key)**: Unique identifier for the school.
- **name (text)**: The official name of the school.
- **category (text)**: School category ('SK' or 'SMK').
- **district (text)**: The district where the school is located.
- **address (text)**: The physical address of the school.
- **contact (text)**: Contact information for the school.

### `public.visits`

Main table for tracking individual visit records.

- **id (uuid, primary key)**: Unique identifier for the visit.
- **school_id (uuid)**: Foreign key to `public.schools.id`.
- **officer_id (uuid)**: Foreign key to `public.profiles.id`.
- **visit_date (date)**: The date of the visit.
- **status (text)**: The status of the visit (e.g., 'draft', 'completed').
- **officer_name (text)**: Name of the visiting officer.
- **pgb (text)**: Name of the PGB (Pengetua/Guru Besar).
- **sesi_bimbingan (text)**: Details of any guidance sessions.
- **created_at (timestamptz)**: Timestamp of when the record was created.

### `public.visit_sections`

Stores the assessment data for each section of a visit.

- **id (uuid, primary key)**: Unique identifier for the section entry.
- **visit_id (uuid)**: Foreign key to `public.visits.id`.
- **section_code (text)**: The SIP+ standard code ('1', '2', '3.1', '3.2', '3.3').
- **evidences (jsonb)**: JSON array storing evidence details.
- **remarks (text)**: Officer's remarks for the section.
- **score (int)**: The score (0-4) given for the section.

### `public.visit_pages`

Stores page-specific data from the visit forms, such as text from DO/ACT/CHECK fields.

- **id (uuid, primary key)**: Unique identifier for the page data entry.
- **visit_id (uuid)**: Foreign key to `public.visits.id`.
- **standard_code (text)**: The SIP+ standard code.
- **page_code (text)**: An identifier for the specific page within the standard's form.
- **data (jsonb)**: JSON object containing the page's form data.

### `public.visit_images`

Stores metadata for uploaded evidence images.

- **id (uuid, primary key)**: Unique identifier for the image record.
- **visit_id (uuid)**: Foreign key to `public.visits.id`.
- **filename (text)**: The name of the file in Supabase Storage.
- **original_name (text)**: The original name of the uploaded file.
- **mime_type (text)**: The MIME type of the image (e.g., 'image/png').
- **size (integer)**: The size of the image in bytes.
- **description (text)**: A user-provided description for the image.
- **section_code (text)**: The SIP+ standard code the image is associated with.
- **uploaded_at (timestamptz)**: Timestamp of when the image was uploaded.

## 2. Security

- **Row Level Security (RLS)**: All tables have RLS enabled. Policies are in place to ensure that users can only read and write their own data. For example, an officer can only select, insert, or update visits where `officer_id` matches their own `auth.uid()`.

---
*This document is a living document and may be updated as the project evolves. For the exact SQL definitions, see `supabase/schema.sql`.*
