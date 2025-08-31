# Product Requirements Document (PRD): SIP+ Visit Tracking System

## 1. Introduction

This document outlines the product requirements for the **SIP+ Visit Tracking System**. The system is a web application designed to modernize and streamline the process of recording, managing, and reporting school visits based on the SIP+ (School Improvement Partners+) standards. It serves education officers by providing a centralized platform for visit assessments, evidence collection, and data analysis.

## 2. Goals and Objectives

- **Primary Goal**: To replace manual, paper-based visit tracking with an efficient, secure, and reliable digital system.
- **Objective 1**: Enable education officers to conduct and record SIP+ assessments for all 5 standards using dynamic, user-friendly forms.
- **Objective 2**: Facilitate the generation of official, standardized PDF reports and visit summaries.
- **Objective 3**: Provide a secure and organized system for uploading and managing evidence (images) associated with each visit.
- **Objective 4**: Maintain a comprehensive and searchable history of all school visits.
- **Objective 5**: Ensure the system is accessible and functional on both desktop and mobile devices.

## 3. Target Audience

- **Primary Users**: Education Officers responsible for conducting school visits and assessments.
- **Secondary Users**: Administrators who oversee the system, manage school data, and may require access to aggregated reports.

## 4. Features

### 4.1. Core Features

- **User Authentication**: Secure login and registration for authorized personnel. Access is restricted based on user roles (officer, admin).
- **School Management**: A comprehensive database of schools, categorized by district. Officers can view and select schools for visits.
- **Visit Creation and Management**: Officers can create new visit records, associating them with a specific school and date.
- **Multi-Standard Assessment Forms**: Interactive forms for all 5 SIP+ standards:
  - Standard 1: Kepimpinan (Leadership)
  - Standard 2: Pengurusan Organisasi (Organizational Management)
  - Standard 3.1: Pengurusan Kurikulum (Curriculum Management)
  - Standard 3.2: Pengurusan Kokurikulum (Co-curricular Management)
  - Standard 3.3: Pengurusan Hal Ehwal Murid (Student Affairs Management)
- **Dynamic Form Sections**: Each standard's form includes sections for DO, ACT, CHECK, and EVIDENCE, with scoring (0-4).
- **Image Upload**: Drag-and-drop functionality to upload image evidence for each assessment section.
- **PDF Generation**: On-demand generation of two types of reports:
  - **Official Borang PDF**: A complete, formatted assessment document for official records.
  - **Visit Summary PDF**: A concise report summarizing the key findings of the visit.
- **Visit History**: A searchable and filterable log of all past visits, showing key details and the number of images uploaded.

### 4.2. Technical Features

- **Responsive Design**: The application is fully responsive and optimized for use on mobile devices.
- **Role-Based Access Control (RBAC)**: Database policies (RLS) ensure users can only access and manage their own data.
- **State Management**: Efficient data fetching and caching using TanStack Query to ensure a smooth user experience.

## 5. Non-Functional Requirements

- **Performance**: The application must load quickly and respond to user interactions without noticeable delay. PDF generation should be completed within a reasonable timeframe.
- **Security**: All data transmission must be encrypted. The system must be protected against common web vulnerabilities. User data is segregated and protected by Row Level Security.
- **Reliability**: The system should be available and operational with minimal downtime.
- **Usability**: The user interface should be intuitive and easy to navigate, requiring minimal training for new users.

## 6. Future Enhancements (Out of Scope for Initial Release)

- **Admin Dashboard**: A dedicated interface for administrators to manage users, schools, and view system-wide analytics.
- **Offline Mode**: Allow officers to conduct assessments in areas with poor internet connectivity and sync data later.
- **Advanced Analytics**: Generate charts and graphs to visualize trends in school performance over time.
- **Bulk Data Import**: Functionality to import school lists from CSV or Excel files.

---
*This document is a living document and may be updated as the project evolves.*
