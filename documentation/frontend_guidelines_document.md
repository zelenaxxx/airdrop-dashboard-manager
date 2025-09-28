# Frontend Guideline Document

This document outlines the frontend setup, architecture, design principles, and technologies used in the `airdrop-dashboard-manager` project. It’s written in everyday language to help anyone—from designers to new developers—understand how the frontend is structured and why certain choices were made.

## 1. Frontend Architecture

### Overview
- We’re building a Single-Page Application (SPA) using **React** combined with **Next.js**. This gives us both client-side interactivity and server-side rendering capabilities out of the box.  
- The project uses the **App Router** pattern provided by Next.js, which means folders and files under `/app` map directly to routes in the browser.  
- API routes live alongside UI code under `/app/api/*`, so backend and frontend remain co-located and easy to navigate.

### How It Supports Scalability, Maintainability, and Performance
- **Scalability:**  Adding new features is as simple as creating a new folder under `/app`. Each feature (auth, dashboard, etc.) has its own directory.  
- **Maintainability:**  Co-located components, styles, and API routes keep related code together. Clear naming (e.g., `page.tsx`, `layout.tsx`) makes it obvious what each file does.  
- **Performance:**  Next.js handles server-side rendering (SSR) and static site generation (SSG) where appropriate. Code-splitting and automatic bundling help keep initial load times low.

## 2. Design Principles

### Key Principles
1. **Usability:** Interfaces should be intuitive. Buttons and forms follow consistent patterns.  
2. **Accessibility:** Use semantic HTML (e.g., `<button>` not `<div>`) and ARIA attributes. Ensure keyboard navigation and sufficient color contrast.  
3. **Responsiveness:** Layouts adapt to desktop, tablet, and mobile screens. We use CSS Flexbox and Grid to achieve fluid layouts.  
4. **Consistency:** Common UI elements (headers, footers, cards) follow the same styling and spacing rules across pages.  

### Applying These Principles
- **Forms:** Labels are paired with inputs. Error messages appear under the relevant field.  
- **Navigation:** A consistent header and sidebar (if present) ensure users always know where they are. The active route is highlighted.  
- **Feedback:** Loading spinners, disabled states, and toast notifications inform the user of ongoing processes or errors.

## 3. Styling and Theming

### Styling Approach
- We use **global CSS** files (`globals.css`, `theme.css`) combined with **CSS Modules** for component-level specificity.  
- Class names follow a **BEM-like convention** (e.g., `card__header`, `button--primary`) for readability and to avoid collisions.  
- All CSS lives under `/styles` or is co-located alongside components (e.g., `Component.module.css`).

### Theming
- `theme.css` defines global CSS variables for colors and spacing. We can switch themes by overriding these variables at the root.  
- Example variables:
  :root {
    --color-primary: #1E3A8A;
    --color-secondary: #F59E0B;
    --color-bg: #FFFFFF;
    --color-text: #1F2937;
    --spacing-unit: 8px;
  }

### Visual Style
- **Look & Feel:** Modern, flat design with subtle shadows and gentle rounded corners.  
- **Glassmorphism Touches:** Semi-transparent overlays for modals or dashboards panels, with a light blur.  

### Color Palette
- Primary: #1E3A8A (deep blue)  
- Secondary: #F59E0B (amber)  
- Success: #10B981 (emerald green)  
- Warning: #FBBF24 (yellow)  
- Error: #EF4444 (red)  
- Background: #F9FAFB (light gray)  
- Text: #1F2937 (dark slate)

### Typography
- **Font Family:** Inter (for a clean, modern look).  
- **Headings:** Use a slightly heavier weight (e.g., 600).  
- **Body Text:** Regular weight (400) at 16px for readability.  

## 4. Component Structure

### Organization
- **Feature Folders:** Under `/app`, each feature (like `dashboard`, `sign-in`, `sign-up`) contains its own `page.tsx`, styles, and any sub-components.  
- **Shared Components:** A `/components` directory holds reusable atoms (buttons, inputs) and molecules (cards, form sections).  
- **Utilities:** Helpers (date formatting, API wrappers) live under `/utils`.

### Reusability and Maintainability
- **Atomic Design:** Start with small components (e.g., Button) and build up to larger ones (e.g., DashboardCard).  
- **Prop-Driven:** Components receive data and callbacks via props. Avoid hard-coded values in components.  
- **Isolation:** Styles scoped via CSS Modules prevent leaking and make components portable.

## 5. State Management

### Approach
- **Local State:** Simple UI toggles or form inputs use React’s built-in `useState` or `useReducer`.  
- **Global State:** Shared data (like user session or theme) uses React’s **Context API**.  
- **Server State:** Data fetched from APIs (airdrop stats, user info) is managed with **React Query** (a.k.a. TanStack Query) for caching, revalidation, and built-in loading/error handling.

### Sharing State Across Components
- Wrap the app in providers (e.g., `<QueryClientProvider>`, `<AuthContext.Provider>`) in `layout.tsx`.  
- Components call hooks (`useAuth()`, `useQuery(['dashboardData'], fetchDashboard)`) to read or update data.

## 6. Routing and Navigation

### File-System Routing
- Next.js App Router links `/app/sign-in/page.tsx` to `/sign-in`.  
- Dynamic routes (e.g., `/app/dashboard/[campaignId]/page.tsx`) can be added by creating bracketed folder names.

### Navigation Structure
- A global header provides links to `Dashboard`, `Profile`, and `Sign Out` when logged in.  
- On the dashboard, a side menu can list individual airdrop campaigns for quick access.  
- Use Next.js’s `<Link>` component for client-side transitions.

## 7. Performance Optimization

### Strategies
1. **Code Splitting & Lazy Loading:**  Use dynamic imports (`next/dynamic`) for large components or charts so they load only when needed.  
2. **Image Optimization:**  Leverage Next.js’s `<Image>` component to serve optimized, responsive images.  
3. **Caching & ISR:**  For public data, use Incremental Static Regeneration (ISR) or static exports to reduce server load.  
4. **Bundle Analysis:**  Use `next-bundle-analyzer` to inspect and trim down third-party libraries.

### User Experience Benefits
- Faster initial page loads.  
- Smoother navigation without full page refreshes.  
- Reduced data usage for users on limited or mobile connections.

## 8. Testing and Quality Assurance

### Testing Layers
1. **Unit Tests:**  Test individual components and utility functions with **Jest** and **React Testing Library**.  
2. **Integration Tests:**  Verify how multiple components work together (e.g., form submission + API call).  
3. **End-to-End Tests:**  Automate key user flows (sign-in, view dashboard) with **Cypress** or **Playwright**.

### Tools and Setup
- **ESLint & Prettier:** Enforce code style and catch common errors.  
- **TypeScript:** Provides compile-time checks for props, API responses, and state.  
- **Git Hooks:** Run tests and linters on pre-commit (via Husky) to keep main branches green.

## 9. Conclusion and Overall Frontend Summary

We’ve chosen a modern React + Next.js stack to deliver a fast, scalable, and maintainable dashboard for managing airdrops. By following these guidelines—clean architecture, clear design principles, modular components, thoughtful state management, and rigorous testing—we ensure that our frontend remains reliable and easy to enhance as the project grows.

Unique aspects of this setup include:
- Co-located API routes and UI code for seamless full-stack development.  
- A mix of server-side and client-side rendering to optimize load times.  
- A themable styling system built on CSS variables and BEM conventions.  
- A robust testing strategy covering unit to end-to-end scenarios.

With these practices in place, any new developer or designer can dive into the codebase, add new features, and maintain a high level of quality and performance throughout the life of the project.