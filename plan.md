# PayMint-Verse: End-to-End Implementation Plan

This document outlines the complete, end-to-end implementation plan for **PayMint-Verse**, a modern, production-grade Bill Splitter and Group Expense Manager. It covers everything from restructuring your current files to building the final analytics dashboards.

## User Review Required

> [!WARNING]
> This is a comprehensive master plan that covers the entire lifecycle of the application. Please review the phases carefully. Once you approve, we will begin with Phase 1 (Architectural Restructuring).

---

## Part 1: Architectural Restructuring (Current Codebase)

Before adding new features, we must restructure the existing codebase into a highly scalable, domain-driven architecture. We will retain your exact `AuthPage` UI and the `Hero` section rotating text.

### Folder Structure Setup
We will reorganize the `src/` directory to decouple business logic from routing:
- **`src/app/`**: Strictly for routing (`page.tsx`, `layout.tsx`). The existing Auth routes and Homepage remain here.
- **`src/features/`**: Domain-driven modules (e.g., `auth/`, `groups/`, `expenses/`). Server actions like `groups.ts` will move here.
- **`src/lib/supabase/`**: Centralized Supabase configuration (`client.ts`, `server.ts`, `session.ts`).
- **`src/services/` & `src/repositories/`**: Abstraction layers for business logic and database queries.
- **`proxy.ts`**: The `src/middleware.ts` will be moved to the root as `proxy.ts` to strictly handle route protection.
- **`supabase/` (Root)**: A root-level folder for `migrations/`, `types/`, and `seed.sql`. Existing SQL files (`granting.sql`, `setup.sql`) will move here.

---

## Part 2: Feature Development Phases

We will build the application in the precise order recommended to ensure a rock-solid foundation.

### Phase 1: Authentication & Security (Supabase SSR)
- **Goal**: Robust, cookie-based session management using `@supabase/ssr`.
- **Implementation**:
  - Implement `proxy.ts` for intercepting requests and refreshing tokens securely.
  - Set up `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.
  - Connect the existing `AuthPage` UI to these new robust SSR clients.
  - Implement protected routes ensuring unauthenticated users cannot reach the dashboard.

### Phase 2: PostgreSQL Schema Design & RLS
- **Goal**: Design the exact tables needed for the full workflow and secure them.
- **Implementation**:
  - Create migrations for: `profiles`, `groups`, `group_members`, `expenses`, `expense_splits`, `settlements`, `activities`, and `notifications`.
  - Enforce **Row Level Security (RLS)**: Users can only read/write data for groups they are members of.

### Phase 3: Profile Management
- **Goal**: Allow users to manage their identity and preferences.
- **Implementation**:
  - `Profile` table syncs automatically with Supabase Auth via triggers.
  - UI for editing Name, Avatar, Currency, Timezone, and Theme.

### Phase 4: Group & Membership System
- **Goal**: Containers for expenses (e.g., "Trip to Hunza").
- **Implementation**:
  - CRUD operations for Groups.
  - Role management: Owner (can delete/edit group) vs Member (can add expenses).
  - Invitation system (via email or shareable link).

### Phase 5: Expense Engine (CRUD & Splits)
- **Goal**: The core functionality to add and split costs.
- **Implementation**:
  - **Expense Form**: Title, Amount, Paid By, Category, Receipt Upload (Supabase Storage).
  - **Split Logic**:
    - *Equal*: Total / N participants.
    - *Custom*: Exact amounts specified per user.
    - *Percentage*: Percentages that must sum to 100%.
    - *Shares*: Proportional calculation based on assigned shares.
  - Editing/Deleting an expense automatically triggers a recalculation.

### Phase 6: Balance Engine (Debt Simplification)
- **Goal**: Compute "Who owes whom?" efficiently.
- **Implementation**:
  - A backend service that continuously aggregates all `expense_splits` to calculate net balances.
  - **Debt Simplification Algorithm**: Reduces the number of transactions required to settle up (e.g., If A owes B $10, and B owes C $10, it simplifies to A owes C $10).
  - Dashboard Cards showing Net Balance, Total Owed, and Total Owed to You.

### Phase 7: Settlement Engine
- **Goal**: Recording payments against debts.
- **Implementation**:
  - UI to "Settle Up" a specific balance.
  - Support for Partial Settlements.
  - Record the payment method (Cash, Bank Transfer, EasyPaisa, etc.).

### Phase 8: Activity Feed & Notifications
- **Goal**: Keep everyone in the loop.
- **Implementation**:
  - Every action (Expense Added, Group Created, Settlement) writes an entry to the `activities` table.
  - Real-time Dashboard feed displaying recent activity (e.g., "Ali added Dinner 2 mins ago").

### Phase 9: Analytics & Export
- **Goal**: Insights into spending habits.
- **Implementation**:
  - Monthly spending charts (Charts.js or Recharts) categorizing expenses (Food, Transport, etc.).
  - CSV/PDF Export functionality for group summaries.

### Phase 10: Homepage Polish & UX Finishing
- **Goal**: Complete the landing page for an incredible first impression.
- **Implementation**:
  - **Hero**: Keep the existing rotating text.
  - **Features Section**: Glassmorphism cards showcasing "Smart Split", "Instant Balances".
  - **How it Works**: Scroll-triggered timeline of the user journey.
  - **Footer**: Corporate style links and branding.

---

## Verification & Testing
At the end of each phase, we will:
1. Verify the UI matches a premium, modern aesthetic (Tailwind + Framer Motion).
2. Test RLS policies rigorously to ensure no data leakage.
3. Validate complex split mathematical calculations via unit tests.
