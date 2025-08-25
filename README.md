# SIP+ Visit Tracking System

A comprehensive web application for managing and tracking school visits across SIP+ standards. This system allows education officers to record visit assessments, generate official PDF reports, maintain visit history, and upload proof images for documentation.

## Features

- **Multi-Standard Assessment**: Support for all 5 SIP+ standards (Leadership, Organization, Curriculum, Co-curriculum, Student Affairs)
- **Interactive Forms**: Dynamic forms with DO, ACT, CHECK, and EVIDENCE sections
- **PDF Generation**: Generate both official borang PDFs and summary reports
- **Image Upload**: Drag & drop image upload with section-specific tagging
- **Visit History**: Complete visit tracking with search, filter, and image count display
- **School Management**: Comprehensive school database with district-based organization
- **User Authentication**: Secure login system with role-based access control
- **Responsive Design**: Mobile-friendly interface with modern UI components

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **UI Components**: shadcn/ui + Tailwind CSS 3.4
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **PDF Generation**: pdf-lib + pdf-parse
- **State Management**: TanStack Query (React Query) v5
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM v6
- **Build Tool**: Vite with SWC for fast compilation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```sh
   git clone <YOUR_REPOSITORY_URL>
   cd sip-tracking-system-main
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_ALLOWED_SIGNUP_DOMAINS=sip.edu.my
   ```

4. **Set up the database**
   - Run the SQL scripts in the `supabase/` folder in order:
     - `schema.sql` (main schema)
     - `upgrade_02.sql` (initial upgrades)
     - `upgrade_03.sql` (image upload support)
     - `upgrade_04.sql` (additional visit fields)
   - Configure Row Level Security (RLS) policies
   - Set up authentication providers
   - Create storage bucket for image uploads

5. **Start the development server**
   ```sh
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080` (updated port)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, etc.)
│   └── ui/            # shadcn/ui components (50+ components)
├── pages/              # Main application pages
│   ├── Index.tsx      # Landing page
│   ├── Login.tsx      # Authentication
│   ├── Signup.tsx     # User registration
│   ├── VisitForm.tsx  # Visit recording form with image upload
│   ├── History.tsx    # Visit history with image counts
│   ├── Schools.tsx    # School management
│   └── NotFound.tsx   # 404 page
├── pdf/               # PDF generation utilities
│   ├── report.ts      # Report PDF generation
│   ├── generator.ts   # Official borang PDF generation
│   └── coordinates.ts # PDF positioning utilities
├── standards/         # SIP+ standards configuration
│   └── config.ts      # Standards and page definitions
├── integrations/      # External service integrations
│   └── supabase/      # Supabase client and types
├── hooks/             # Custom React hooks
└── lib/               # Utility functions
```

## SIP+ Standards Coverage

The system supports all 5 SIP+ standards with comprehensive assessment criteria:

1. **Standard 1: Kepimpinan (Leadership)**
   - PGB as school leader
   - Strategic planning and monitoring
   - Leadership effectiveness assessment

2. **Standard 2: Pengurusan Organisasi (Organizational Management)**
   - Human resource management
   - Financial and infrastructure management
   - Organizational efficiency

3. **Standard 3.1: Pengurusan Kurikulum (Curriculum Management)**
   - Curriculum implementation
   - Teaching and learning processes
   - Academic performance tracking

4. **Standard 3.2: Pengurusan Kokurikulum (Co-curricular Management)**
   - Co-curricular activities
   - Student development programs
   - Extracurricular engagement

5. **Standard 3.3: Pengurusan Hal Ehwal Murid (Student Affairs Management)**
   - Student welfare
   - Discipline and guidance
   - Student support services

## New Features

### Image Upload System
- **Drag & Drop Interface**: Modern file upload with visual feedback
- **Proof Documentation**: Upload images as evidence for visit assessments
- **Section Tagging**: Associate images with specific SIP+ standards
- **PDF Integration**: Images automatically included in generated reports
- **Storage Management**: Secure cloud storage with Supabase

### Enhanced Visit Management
- **Officer Information**: Track officer name, PGB, and guidance sessions
- **Image Counts**: Display number of uploaded images in visit history
- **Rich Metadata**: Comprehensive visit information tracking

## PDF Reports

The system generates two types of PDF reports:

1. **Official Borang PDF**: Complete assessment forms for official use with embedded images
2. **Visit Report PDF**: Summary reports with formatted sections (PLAN, DO, CHECK, EVIDENCE, ACT) and image listings

## Database Schema

### Core Tables
- `profiles`: User profiles and role-based access control
- `schools`: School information with district categorization
- `visits`: Visit records with metadata (officer_name, pgb, sesi_bimbingan)
- `visit_sections`: Section-level assessment data with scoring
- `visit_pages`: Page-specific data storage (DO, ACT text)
- `visit_images`: Image metadata and section associations

### Security Features
- **Row Level Security (RLS)**: Users can only access their own data
- **Role-based Access**: Officer and admin role distinctions
- **Authenticated Operations**: All operations require valid authentication

## Development Scripts

```sh
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Configuration

### Development Server
- **Port**: 8080 (updated from default 5173)
- **Host**: All interfaces (::)
- **Hot Reload**: Enabled with SWC compiler
- **Component Tagger**: Development-only component identification

### Build Configuration
- **Target**: Modern browsers with ES modules
- **Optimization**: SWC for fast compilation
- **Path Aliases**: `@` points to `src/` directory

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Recent Updates

### Version 0.0.0 (Latest)
- ✅ Image upload system with drag & drop
- ✅ Enhanced visit metadata (officer_name, pgb, sesi_bimbingan)
- ✅ Updated database schema with image support
- ✅ Improved PDF generation with image integration
- ✅ Enhanced UI components (50+ shadcn/ui components)
- ✅ Mobile-responsive design improvements
- ✅ Updated development server configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Documentation

- [Image Upload Setup Guide](./IMAGE_UPLOAD_SETUP.md) - Complete guide for image upload functionality
- [Database Schema](./supabase/schema.sql) - Complete database structure
- [Migration Scripts](./supabase/) - Database upgrade scripts
