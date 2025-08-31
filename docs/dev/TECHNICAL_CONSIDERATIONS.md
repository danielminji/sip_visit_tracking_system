# Technical Considerations: SIP+ Visit Tracking System

This document details the technical stack, architecture, and key implementation decisions for the SIP+ Visit Tracking System.

## 1. Frontend Technology Stack

- **Framework**: React 18 with TypeScript. Chosen for its robust ecosystem, component-based architecture, and type safety, which is crucial for a data-intensive application.
- **Build Tool**: Vite 5 with SWC. Selected for its extremely fast development server startup and build times, significantly improving developer experience.
- **Styling**: Tailwind CSS 3.4 with PostCSS. A utility-first CSS framework that allows for rapid UI development without leaving the HTML.
- **UI Components**: shadcn/ui. A collection of beautifully designed, accessible, and unstyled components that can be easily customized. This avoids vendor lock-in and provides full control over the look and feel.
- **State Management**: TanStack Query (React Query) v5. Used for managing server state, including data fetching, caching, and synchronization. It simplifies data handling and reduces boilerplate code.
- **Form Handling**: React Hook Form with Zod for validation. Provides a performant and flexible way to manage complex forms, with schema-based validation ensuring data integrity.
- **Routing**: React Router DOM v6. The standard for routing in React applications, offering a declarative way to manage navigation.

## 2. Backend and Database

- **Platform**: Supabase. Chosen as the Backend-as-a-Service (BaaS) provider to accelerate development. It provides a managed PostgreSQL database, authentication, storage, and auto-generated APIs.
- **Database**: PostgreSQL. A powerful, open-source object-relational database system known for its reliability and feature robustness.
- **Authentication**: Supabase Auth. Handles user registration, login, and session management. It integrates seamlessly with the database and supports Row Level Security.
- **Storage**: Supabase Storage. Used for securely storing user-uploaded files (visit evidence images).

## 3. Key Features Implementation

- **PDF Generation**: The `pdf-lib` library is used for creating and manipulating PDF documents directly in the browser. This allows for dynamic generation of official forms and summary reports based on user data.
- **Image Upload**: A custom implementation using React components for a drag-and-drop interface. Files are uploaded directly to Supabase Storage, and metadata is stored in the `visit_images` table.
- **Security**: Row Level Security (RLS) is heavily utilized in Supabase. Policies are defined to ensure that users can only access or modify their own data, providing a strong security posture at the database level.

## 4. Development and Deployment

- **Environment Variables**: The application uses a `.env` file to manage environment-specific configurations, such as Supabase credentials. This separates configuration from code and enhances security.
- **Path Aliases**: A path alias (`@`) is configured to point to the `src/` directory, simplifying import paths and improving code readability.
- **Deployment**: The project is configured for deployment on Vercel, as indicated by the `vercel.json` file and the use of Vercel Analytics.

## 5. Code Quality and Maintenance

- **Linting**: ESLint is configured to enforce code quality and consistency across the project.
- **Project Structure**: The codebase is organized into logical directories (`components`, `pages`, `hooks`, `lib`, etc.) to promote maintainability and scalability.

---
*This document is a living document and may be updated as the project evolves.*
