# asdspecials

## What This Project Is
The user wants to build an ecommerce landing page for selling home decor. The goal is to create a luxurious and seamless buying experience for the users, in contrast to the current disorganized and chaotic website at asdspecials.com.

## Stack

| Layer       | Technology | Reason                                                           |
| ----------- | ---------- | ---------------------------------------------------------------- |
| Auth        | Supabase Auth | Provides a secure and scalable authentication solution.      |
| Build       | Next.js (built-in) | Chosen for its robust feature set and developer experience. |
| Deploy      | Vercel | Seamless deployment and hosting platform for Next.js projects. |
| Styling     | Tailwind CSS + shadcn/ui | Tailwind provides a utility-first approach, while shadcn/ui offers a collection of high-quality UI components. |
| Database    | Supabase (PostgreSQL) | Supabase provides a full-featured, Postgres-based database solution. |
| Frontend    | Next.js + TypeScript | TypeScript ensures type safety and improved developer experience. |
| Reasoning   | Manually configured | The user has specific requirements and wants to have full control over the stack. |

## First Time Setup
1. Check if `.env.local` exists. If not, copy from `.env.example`.
2. Fill in the required environment variables:
   - `SUPABASE_URL`: Your Supabase project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase anon key.
3. Run `pnpm install` to install all dependencies.
4. Run `pnpm dev` to start the development server.
5. Verify the app loads at `localhost:3000`.

## Before You Start Coding
IMPORTANT instructions for Claude Code:
- Before writing any code, ask the user what they want to build first. Don't assume.
- If the user's description is vague, ask clarifying questions about: target audience, key features, design style, and priority.
- Always verify env vars are configured before attempting to run or build.

## Project Structure
- `.env.example`: Example environment variables file.
- `.gitignore`: Defines files and folders to be ignored by Git.
- `CLAUDE.md`: This operational guide for Claude Code.
- `README.md`: General project documentation.
- `app/`: Next.js app directory structure:
  - `(frontend)/`: Contains all frontend-related components and pages.
  - `(payload)/`: Holds Payload CMS-related files.
  - `api/`: Handles API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and Supabase client setup.
- `payload/`: Payload CMS configuration.
- `scripts/`: Scripts for database management.
- `stores/`: Global state management (if needed).
- `types/`: TypeScript type definitions.

## Key Conventions
- TypeScript strict mode, no `any`.
- All database queries through Supabase client.
- Server components by default, 'use client' only when needed.
- Mobile-first responsive design.
- Any org conventions listed above.

## Common Commands
```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # Run linter
```

## What NOT To Do
- Don't skip env var setup.
- Don't use `any` in TypeScript.
- Don't commit `.env.local`.
- Don't modify files in `node_modules`.
- Don't install packages without asking the user first.