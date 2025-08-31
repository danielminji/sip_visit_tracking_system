# Task List: SIP+ Visit Tracking System

This document tracks the major tasks for the development, deployment, and maintenance of the SIP+ Visit Tracking System. Mark tasks as complete by changing `[ ]` to `[x]`.

## Phase 1: Project Setup & Core Infrastructure

- [x] Initialize project repository
- [x] Set up Vite + React + TypeScript frontend
- [x] Configure Supabase project (Database, Auth, Storage)
- [x] Define initial database schema (`schema.sql`)
- [x] Implement basic user authentication (Login/Signup)
- [ ] Set up CI/CD pipeline with Vercel

## Phase 2: Feature Development

### Core Visit Management
- [x] Create school management page (list, add, edit schools)
- [x] Develop the main visit form structure
- [x] Implement dynamic forms for all 5 SIP+ standards
- [x] Integrate form state management with React Hook Form
- [x] Implement data saving to Supabase tables (`visits`, `visit_sections`, `visit_pages`)

### Image Upload Functionality
- [x] Design and implement drag-and-drop image upload component
- [x] Integrate with Supabase Storage for file uploads
- [x] Link uploaded images to specific visits and sections (`visit_images` table)
- [x] Display uploaded images in the visit form and history

### Reporting
- [x] Implement PDF generation for the official `borang`
- [x] Implement PDF generation for the visit summary report
- [ ] Ensure generated PDFs include relevant data and images

### UI/UX and History
- [x] Develop the visit history page
- [x] Add search and filter functionality to the visit history
- [x] Ensure the entire application is responsive and mobile-friendly
- [x] Implement UI components using shadcn/ui and Tailwind CSS

## Phase 3: Testing

- [ ] **Unit Testing**: Write unit tests for critical utility functions and components.
- [ ] **Integration Testing**: Test the integration between the frontend and Supabase backend.
  - [ ] Test form submissions and data integrity.
  - [ ] Test image upload and retrieval.
  - [ ] Test PDF generation with various data inputs.
- [ ] **End-to-End (E2E) Testing**: Simulate user workflows from login to report generation.
- [ ] **User Acceptance Testing (UAT)**: Conduct testing with a group of education officers to gather feedback.

## Phase 4: Deployment & Launch

- [ ] Finalize production environment configuration
- [ ] Perform a full production build
- [ ] Deploy the application to Vercel
- [ ] Conduct post-launch monitoring to identify and fix any issues

## Phase 5: Performance & Security

- [ ] **Performance Audit**: Analyze and optimize application load times and runtime performance.
- [ ] **Security Review**:
  - [x] Verify all Supabase Row Level Security (RLS) policies are correctly implemented.
  - [ ] Conduct a review for common web vulnerabilities (XSS, CSRF).
  - [ ] Ensure all dependencies are up-to-date and free of known vulnerabilities.

---
*This is a living document.*
