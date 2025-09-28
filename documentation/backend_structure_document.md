# Backend Structure Document for airdrop-dashboard-manager

## 1. Backend Architecture

Overall Design:
- Built on Node.js and Next.js using the App Router.
- API routes under `/app/api` handle server-side logic as serverless functions.
- Follows a service–repository pattern:
  - **Controller layer** (Next.js API routes) validates requests and returns responses.
  - **Service layer** contains business logic (e.g., user authentication, campaign management).
  - **Data access layer** (Prisma ORM) interacts with the database.

Scalability, Maintainability, Performance:
- **Serverless functions** auto-scale based on traffic, avoiding idle costs.
- **Modular code structure** (controllers, services, data access) makes it easy to add features or swap components.
- **TypeScript** ensures type safety across layers, reducing runtime errors.
- **Static file serving** (CSS, images) offloads traffic to a CDN for faster load times.

## 2. Database Management

Technologies:
- Relational database (SQL): **PostgreSQL**
- ORM: **Prisma** for schema definitions, migrations, and type-safe queries.

Data Structure and Access:
- Data defined as tables and relations (one-to-many, many-to-one).
- Prisma schema holds model definitions and generates a client for queries.
- Migrations are managed via Prisma Migrate, ensuring versioned changes to the database.
- Backup strategy: regular RDS snapshots or managed backups in hosted environments.

## 3. Database Schema

Human-readable overview:
- **User**: Stores account details and login credentials.
- **Session**: Tracks active sessions or JWT tokens per user.
- **Campaign**: Represents an airdrop campaign owned by a user.
- **Participant**: Records each wallet or user registered for a campaign.

PostgreSQL schema (SQL):

```sql
CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Session" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  token VARCHAR(512) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE "Campaign" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Participant" (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES "Campaign"(id) ON DELETE CASCADE,
  wallet_address VARCHAR(66) NOT NULL,
  eligible BOOLEAN DEFAULT FALSE,
  distributed BOOLEAN DEFAULT FALSE,
  distributed_at TIMESTAMP WITH TIME ZONE
);
```  

## 4. API Design and Endpoints

Approach:
- Follows RESTful conventions via Next.js API routes.
- JSON input/output, HTTP status codes to indicate success or errors.
- Protected endpoints require a valid JWT or session cookie.

Key Endpoints:

Authentication:
- `POST /api/auth/signup`  
  Registers a new user (email, password).
- `POST /api/auth/signin`   
  Verifies credentials, issues JWT or session cookie.
- `POST /api/auth/signout`  
  Invalidates the user’s session.

Dashboard & Campaigns:
- `GET /api/dashboard/campaigns`  
  Returns all campaigns for the authenticated user.
- `POST /api/dashboard/campaigns` 
  Creates a new airdrop campaign.
- `GET /api/dashboard/campaigns/:id/participants`  
  Lists participants for a specific campaign.
- `POST /api/dashboard/campaigns/:id/participants`  
  Adds a wallet to the campaign’s participant list.

Metrics & Reports:
- `GET /api/dashboard/campaigns/:id/metrics`  
  Returns distribution status, participant counts, and other stats.

## 5. Hosting Solutions

Primary Hosting:
- **Vercel** for Next.js deployment (frontend + serverless API endpoints).
  - Automatic scaling of serverless functions.
  - Global edge network for fast responses.

Database Hosting:
- **AWS RDS for PostgreSQL** (or a managed equivalent like Supabase).
  - Automated backups and multi-AZ replication for high availability.

Advantages:
- Zero-server maintenance with Vercel.
- Pay-as-you-go pricing for serverless.
- Global distribution reduces latency for users worldwide.

## 6. Infrastructure Components

Load Balancing:
- Built into Vercel’s edge network, routing requests to the nearest endpoint.

Caching:
- **Redis** (e.g., AWS ElastiCache or Upstash) for:
  - Session store or JWT blacklist.
  - Frequent read-heavy queries (campaign lists, metrics).
- HTTP-level caching with **Cache-Control** headers on static assets.

Content Delivery Network (CDN):
- Vercel’s built-in CDN for all static files and cached API responses.

Logging & Tracing:
- **Sentry** for error tracking and performance monitoring.
- Vercel Logs or **Datadog** for request/response logs and metrics.

## 7. Security Measures

Authentication & Authorization:
- Passwords hashed with **bcrypt** before storage.
- JWT tokens signed with a strong secret key, short TTLs.
- Protected API routes check for valid tokens or session cookies.

Data Protection:
- All traffic over **HTTPS**.
- Database encryption at rest (RDS-managed).
- Environment variables (secrets) stored securely (Vercel env vars).

Request Validation & Rate Limiting:
- Input validated server-side using a schema validator (e.g., Zod).
- Rate limiting middleware on auth routes to prevent brute-force attacks.

Compliance:
- Adheres to GDPR guidelines: users can request data deletion.

## 8. Monitoring and Maintenance

Performance Monitoring:
- Vercel Analytics for request metrics (latency, error rates).
- Sentry for tracing slow API calls and uncaught exceptions.

Uptime & Alerts:
- Health check pings with external service (e.g., UptimeRobot).
- Alerting configured via Sentry or Datadog on critical errors.

Maintenance Workflow:
- **CI/CD pipeline** in GitHub Actions:
  - Runs linting, unit tests, and integration tests on each pull request.
  - Auto-deploy to staging on merge to main branch.
- **Prisma Migrate** for versioned database changes.
- Scheduled backups and canary deployments.

## 9. Conclusion and Overall Backend Summary

This backend is a serverless, Node.js-based API built with Next.js and TypeScript. It uses PostgreSQL via Prisma for structured data storage, all hosted on Vercel and AWS RDS. Core ideas:

- **Scalable serverless functions** keep costs aligned with usage.
- **Modular design** (controllers, services, data) ensures easy maintenance.
- **Robust security** with hashed passwords, JWTs, HTTPS, and rate limiting.
- **Comprehensive monitoring** via Vercel, Sentry, and external health checks.

Together, these components provide a reliable, performant, and secure foundation for the airdrop-dashboard-manager. The setup allows the team to iterate quickly, add new features without major architectural changes, and serve users worldwide with low latency.