# Image Upload Setup Guide

This guide explains how to set up image upload functionality for the SIP+ Tracking System.

## Features Added

- **Image Upload Component**: Drag & drop or click to upload images
- **Proof Images**: Users can upload images as proof of visiting schools
- **Section-specific Images**: Images can be tagged to specific standards (1, 2, 3.1, 3.2, 3.3)
- **PDF Integration**: Images are included in generated PDFs and reports
- **History Display**: Image count is shown in the visit history table

## Database Changes

### New Table: `visit_images`

```sql
create table public.visit_images (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  filename text not null,
  original_name text not null,
  mime_type text not null,
  size integer not null,
  description text,
  section_code text check (section_code in ('1','2','3.1','3.2','3.3')),
  uploaded_at timestamptz not null default now()
);
```

### Storage Bucket: `visit-images`

- **File size limit**: 5MB
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Public access**: Yes (for viewing uploaded images)

## Setup Instructions

### 1. Run Database Migration

Execute the SQL in `supabase/upgrade_03.sql` in your Supabase SQL editor:

```bash
# Copy and paste the contents of upgrade_03.sql into Supabase SQL editor
# This will create the visit_images table and storage bucket
```

### 2. Update Supabase Storage Policies

The migration creates the necessary storage policies, but verify they exist:

```sql
-- Check if policies exist
select * from storage.policies where bucket_id = 'visit-images';
```

### 3. Test the Functionality

1. **Start a new visit** in the application
2. **Upload images** using the new image upload component
3. **Generate PDFs** to see images included in reports
4. **Check history** to see image counts

## How It Works

### Image Upload Flow

1. User selects or drags an image file
2. File is validated (type, size)
3. Image is uploaded to Supabase Storage
4. Metadata is saved to `visit_images` table
5. Image is displayed in the UI and available for PDF generation

### PDF Integration

- **Official PDF**: Images are embedded directly in the PDF
- **Visit Report**: Image descriptions are listed in the report
- **Section-specific**: Images are grouped by standard section

### Security Features

- **Row Level Security (RLS)**: Users can only access their own visit images
- **File validation**: Only image files under 5MB are accepted
- **Authenticated access**: Only logged-in users can upload/view images

## File Structure

```
src/
├── components/ui/
│   └── image-upload.tsx          # Main image upload component
├── pages/
│   ├── VisitForm.tsx             # Updated with image upload
│   └── History.tsx               # Updated to show image counts
└── pdf/
    ├── generator.ts               # Updated to include images in PDFs
    └── report.ts                  # Updated to include images in reports
```

## Environment Compatibility

### Local Development
- Images are stored in Supabase (cloud storage)
- Works the same as hosted environment
- No local file system dependencies

### Hosted Environment
- Same functionality as local development
- Images are served from Supabase CDN
- Scalable storage solution

## Troubleshooting

### Common Issues

1. **Upload fails**: Check Supabase storage policies and bucket configuration
2. **Images not showing in PDF**: Verify image URLs are accessible
3. **Permission denied**: Ensure RLS policies are correctly configured

### Debug Steps

1. Check browser console for errors
2. Verify Supabase storage bucket exists
3. Confirm RLS policies are active
4. Test image upload in Supabase dashboard

## Future Enhancements

- Image compression and optimization
- Multiple image upload
- Image editing capabilities
- Advanced image organization
- Image search and filtering
