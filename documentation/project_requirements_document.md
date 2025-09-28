# Project Requirements Document (PRD)

## 1. Project Overview

Airdrop Dashboard Manager is a single-page web application built to simplify how token airdrop campaigns are monitored and managed. It provides users with an intuitive, centralized interface where they can sign up, sign in, and immediately access real-time summaries of their airdrop campaigns—showing participant counts, distribution progress, and key metrics—without having to juggle spreadsheets or multiple APIs.

This application is being created to address the common pain points of manual tracking and fragmented data sources. By offering secure user authentication and a visually organized dashboard, the project aims to save time, reduce errors, and ensure every campaign stakeholder has the insights they need at a glance. Key success criteria include fast load times (under 2 seconds for the main dashboard), reliable authentication flows, and a clear, responsive UI that works across devices.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- User sign-up and sign-in using email and password.
- Protected dashboard page that only signed-in users can access.
- Dashboard UI rendering mock or static data from `data.json` (campaign list, metrics, participant counts).
- Basic layout and theming (global styles, consistent header/nav).
- File-system–based routing via Next.js App Router.
- Local development configuration with environment variables for secret keys.

**Out-of-Scope (Later Phases):**
- Integration with a real database (PostgreSQL, MongoDB) or an ORM/ODM.
- Third-party identity providers (Google, MetaMask, etc.).
- Email verification, password reset flows.
- Advanced analytics or graphing libraries beyond basic metric display.
- Notifications (email or in-app) and scheduling features.
- Multi-tenant or organization-level roles and permissions.

## 3. User Flow

When a new visitor lands on the site, they see a sign-in page by default with a link to sign up. If they don’t have an account, they click “Sign Up,” fill out the registration form (email and password), and submit. The application calls the `/api/auth/signup` endpoint, confirms the credentials, creates a session, and then redirects the user to the dashboard.

Once logged in, the user arrives at the dashboard screen wrapped in a global layout (header with logo and sign-out button, sidebar or nav element). The dashboard page fetches data from `data.json` (or future API) and displays campaign summaries: total participants, distribution progress bars, and quick stats cards. The user can log out at any time to end their session.

## 4. Core Features

- User Authentication
  - Sign-up endpoint (`/api/auth/signup`) and UI form.
  - Sign-in endpoint (`/api/auth/signin`) and UI form.
  - Session management via secure, HTTP-only cookies.

- Dashboard Display
  - Fetch and render campaign data from `data.json`.
  - Cards for metrics (participant count, token distribution percentage).
  - Responsive layout for desktop and mobile.

- Layout & Theming
  - Global layout component with header/navigation.
  - `globals.css` and `theme.css` for consistent styling.

- File-System Routing
  - Next.js App Router (`/app/dashboard`, `/app/sign-in`, `/app/sign-up`, `/app/api/auth`).

- API Routes
  - `app/api/auth/*` endpoints for auth logic.
  - Structured for future expansion (e.g., `/api/airdrop`).

## 5. Tech Stack & Tools

- Frontend Framework: Next.js (React) with TypeScript using the App Router.
- Backend: Next.js API Routes (Node.js) for serverless functions.
- Styling: Global CSS files (`globals.css`, `theme.css`), expandable with CSS frameworks (e.g., Tailwind CSS in later phases).
- Data Layer: Initial static `data.json`, placeholder for real database.
- Authentication: Custom email/password flow, bcrypt for hashing passwords.
- Development Tools: Visual Studio Code, ESLint, Prettier for formatting, Git for version control.

## 6. Non-Functional Requirements

- Performance: Dashboard main page must load in under 2 seconds on a standard broadband connection.
- Security:
  - All API routes served over HTTPS.
  - Passwords hashed with bcrypt and never stored in plain text.
  - HTTP-only, secure cookies for session tokens.
  - Rate limiting on auth endpoints (e.g., 5 attempts per minute).
- Usability: Responsive design supporting modern browsers (Chrome, Firefox, Safari) on desktop and mobile.
- Maintainability: Code linted and formatted automatically; clear folder structure.

## 7. Constraints & Assumptions

- The project uses Next.js App Router, so Node.js runtime is assumed (v16+).
- No external database is available in v1; data.json is used as a stand-in.
- Environment variables (e.g., JWT secret, bcrypt salt rounds) must be set in a `.env.local` file.
- Serverless deployment (Vercel, Netlify) with cold-start considerations.

## 8. Known Issues & Potential Pitfalls

- **Static JSON Dependence:** Relying on `data.json` means no real persistence. Plan for migration to a proper database and update fetch logic.
- **Serverless Cold Starts:** If deployed serverless, API route cold starts can add latency. Consider warming or switching to a containerized environment in the future.
- **Rate Limiting Enforcement:** Must configure or integrate a rate-limiter middleware to prevent brute-force attacks.
- **Error Handling:** Current code may lack centralized error pages or consistent HTTP error codes—add a middleware for uniform handling.
- **Scalability of State:** As dashboard complexity grows, introduce a state-management library (Zustand or React Context) to avoid prop drilling.


*End of PRD.*