@AGENTS.md
# CLAUDE.md

## Project Overview

This is a production-grade **ISP Management System** built with Next.js App Router.

The primary goal of this project is to provide a maintainable, scalable, and strongly typed management system for ISP operations, including:

* Authentication
* Customer Management
* Service Plans
* Billing
* Payments
* Reports (future)
* AI Automation (future)

Always prioritize correctness, maintainability, and consistency over speed.

---

# Tech Stack

Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Table
* React Hook Form
* Zod
* Redux Toolkit

Backend

* Prisma 6
* Supabase PostgreSQL
* Supabase Auth

---

# Architecture

All database operations follow this flow:

```text
Server Component
        ↓
Server Action
        ↓
Prisma
        ↓
Supabase PostgreSQL
```

Rules

* Never access Prisma directly from Client Components.
* Never call the database from the browser.
* Use Server Actions for all CRUD operations.
* Do not introduce REST APIs unless integrating with an external service.
* Prefer Server Components whenever possible.

---

# Authentication

Authentication is handled using Supabase Auth.

Responsibilities include:

* Login
* Logout
* Middleware protection
* Session validation

Do not replace the authentication flow.

---

# Folder Structure

```
actions/
plans/
customers/
billing/
payments/

components/
plans/
customers/
billing/
payments/

schemas/
types/
lib/
```

Keep related files together.

Avoid creating unnecessary folders.

---

# Database Principles

Use Prisma as the only ORM.

Use Prisma-generated types whenever possible.

Do not duplicate data.

Relationships should be represented using foreign keys.

Example:

Customer

* plan_id

Billing

* customer_id

Payments

* billing_id

Do not duplicate billing information inside the customer table.

---

# Server Actions

All database mutations must be implemented using Server Actions.

Every Server Action returns:

```ts
type TActionResponse<T> = {
  success: boolean
  message: string
  data?: T
}
```

Do not throw raw errors to the UI.

Return meaningful messages.

---

# TypeScript Standards

Always use strict typing.

Never use

```ts
any
```

Prefer

* Prisma-generated types
* Type inference
* Utility types
* Generics

Avoid unnecessary type assertions.

---

# React Guidelines

Prefer Server Components.

Use Client Components only when needed for:

* Forms
* Local state
* Browser APIs
* Interactive UI

Keep components focused on a single responsibility.

---

# Forms

All forms should use:

* React Hook Form
* Zod

Validation belongs inside Zod schemas.

Do not duplicate validation logic.

---

# Tables

Use TanStack Table for all data tables.

Table features should support when applicable:

* Sorting
* Pagination
* Filtering
* Global Search
* Row Selection
* Column Visibility

Business logic belongs in the parent table component.

Presentation components should only render UI.

---

# UI Standards

Use shadcn/ui components whenever available.

Preferred components include:

* Table
* Button
* Input
* Select
* Dropdown Menu
* Dialog
* Drawer
* Badge
* Skeleton
* Checkbox
* Pagination

Do not mix multiple UI libraries.

---

# State Management

Use Redux Toolkit only for application-wide shared state.

Prefer local component state when global state is unnecessary.

Do not introduce additional state management libraries.

---

# Styling

Use Tailwind CSS.

Keep styling consistent.

Avoid inline styles unless unavoidable.

Prefer reusable UI components.

---

# Naming Conventions

Components

```
CustomersTable.tsx
CustomerActions.tsx
AddCustomerDrawer.tsx
UpdateCustomerDrawer.tsx
```

Server Actions

```
createCustomer()
updateCustomer()
deleteCustomer()
getCustomers()
```

Schemas

```
customerSchema
planSchema
```

Types

```
CustomerForm
CustomerResponse
```

Use descriptive names.

Avoid abbreviations.

---

# Error Handling

Validate all input.

Handle expected failures gracefully.

Return user-friendly error messages.

Do not expose database errors directly to the client.

---

# Performance

Prefer Server Components.

Avoid unnecessary Client Components.

Avoid unnecessary re-renders.

Avoid premature optimization.

Load only the data required for the current page.

---

# Code Quality

Write production-ready code.

Avoid placeholder implementations.

Avoid tutorial-style examples.

Do not rewrite unrelated code.

Keep functions small and focused.

Prefer readability over cleverness.

Follow SOLID principles where appropriate.

Avoid unnecessary abstractions.

---

# Development Workflow

When implementing a new feature:

1. Understand the existing architecture.
2. Reuse existing patterns.
3. Keep naming consistent.
4. Maintain strong typing.
5. Keep business logic centralized.
6. Build reusable components.
7. Preserve backward compatibility whenever possible.

---

# Debugging Rules

When debugging:

* Diagnose before proposing fixes.
* Do not guess.
* If required code is missing, request it first.
* If a package version may affect the solution, ask for the version before recommending changes.
* If a previous recommendation was incorrect, explicitly explain why and provide one corrected solution.

---

# AI Assistant Behavior

When generating code for this repository:

* Respect the existing architecture.
* Do not introduce alternative architectural patterns unless explicitly requested.
* Produce complete, production-ready implementations.
* Do not use mock data unless requested.
* Do not generate incomplete tutorial snippets.
* Keep recommendations consistent throughout the project.
* If multiple valid implementations exist, choose one and remain consistent unless asked otherwise.
* Prefer maintainability, correctness, and clarity over brevity.
