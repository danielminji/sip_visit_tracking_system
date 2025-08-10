# SIP+ Visit Tracking System

A comprehensive web application for managing and tracking school visits across SIP+ standards. This system allows education officers to record visit assessments, generate official PDF reports, and maintain visit history.

## Features

- **Multi-Standard Assessment**: Support for all 5 SIP+ standards (Leadership, Organization, Curriculum, Co-curriculum, Student Affairs)
- **Interactive Forms**: Dynamic forms with DO, ACT, CHECK, and EVIDENCE sections
- **PDF Generation**: Generate both official borang PDFs and summary reports
- **Visit History**: Complete visit tracking with search and filter capabilities
- **School Management**: Comprehensive school database with district-based organization
- **User Authentication**: Secure login system with role-based access

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **PDF Generation**: pdf-lib
- **State Management**: React Query (TanStack Query)

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
   - Run the SQL scripts in the `supabase/` folder
   - Configure Row Level Security (RLS) policies
   - Set up authentication providers

5. **Start the development server**
   ```sh
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, etc.)
│   └── ui/            # shadcn/ui components
├── pages/              # Main application pages
│   ├── Index.tsx      # Landing page
│   ├── Login.tsx      # Authentication
│   ├── VisitForm.tsx  # Visit recording form
│   ├── History.tsx    # Visit history
│   └── Schools.tsx    # School management
├── pdf/               # PDF generation utilities
│   ├── report.ts      # Report PDF generation
│   └── generator.ts   # Official borang PDF generation
├── standards/         # SIP+ standards configuration
│   └── config.ts      # Standards and page definitions
└── integrations/      # External service integrations
    └── supabase/      # Supabase client and types
```

## SIP+ Standards Coverage

The system supports all 5 SIP+ standards:

1. **Standard 1: Kepimpinan (Leadership)**
   - PGB as school leader
   - Strategic planning and monitoring

2. **Standard 2: Pengurusan Organisasi (Organizational Management)**
   - Human resource management
   - Financial and infrastructure management

3. **Standard 3.1: Pengurusan Kurikulum (Curriculum Management)**
   - Curriculum implementation
   - Teaching and learning processes

4. **Standard 3.2: Pengurusan Kokurikulum (Co-curricular Management)**
   - Co-curricular activities
   - Student development programs

5. **Standard 3.3: Pengurusan Hal Ehwal Murid (Student Affairs Management)**
   - Student welfare
   - Discipline and guidance

## PDF Reports

The system generates two types of PDF reports:

1. **Official Borang PDF**: Complete assessment forms for official use
2. **Visit Report PDF**: Summary reports with formatted sections (PLAN, DO, CHECK, EVIDENCE, ACT)

## Database Schema

Key tables:
- `schools`: School information and categorization
- `visits`: Visit records with metadata
- `visit_sections`: Section-level assessment data
- `visit_pages`: Page-specific data (DO, ACT text)
- `profiles`: User profiles and roles

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
