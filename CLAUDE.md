# asdspecials

## Project Overview

A ecommerce landing page, where we will be selling deco. The idea is to build a landing page with luxury vibes, and the process to buy should be really an experience for the user. We can fetch this site: https://asdspecials.com as reference. We are using this woocomerce now, and looks bad, not organized, and transmiting disorder.

## Stack Details

- **Frontend**: Next.js + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build**: Next.js (built-in)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel
- **Reasoning**: Manually configured

## Folder Structure

The project follows a modular structure, with the following main folders:

- `src/`
  - `components/`: Contains all the reusable UI components.
  - `pages/`: Contains the Next.js pages.
  - `styles/`: Contains the global styles and Tailwind CSS configuration.
  - `lib/`: Contains utility functions, API clients, and other shared logic.
  - `hooks/`: Contains custom React hooks.
  - `types/`: Contains type definitions used throughout the project.

## Key Conventions

- Follow the Next.js file-based routing convention.
- Use TypeScript for type safety and better developer experience.
- Adhere to the Tailwind CSS naming conventions and utility-first approach.
- Organize components into related folders (e.g., `components/layout`, `components/product`).
- Use descriptive variable and function names.
- Write meaningful commit messages that describe the changes.
- Document any complex or non-obvious functionality.

## Common Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the production-ready application.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs the linter.
- `npm run test`: Runs the tests.

## Architecture Decisions

1. **Front-end Framework**: Next.js was chosen for its server-side rendering capabilities, file-based routing, and robust ecosystem.
2. **Styling**: Tailwind CSS was selected for its utility-first approach, which promotes consistency and developer productivity. The shadcn/ui library was included to provide a set of pre-built, accessible components.
3. **Database**: Supabase was chosen for its seamless integration with PostgreSQL and the built-in authentication features.
4. **Deployment**: Vercel was selected for its tight integration with Next.js and the overall ease of use.

## What NOT to Do

- Do not directly modify global styles or the Tailwind CSS configuration without careful consideration.
- Avoid over-engineering or over-abstracting components and functionality.
- Do not introduce unnecessary dependencies or libraries without justification.
- Refrain from merging incomplete or untested features into the main branch.
## Recommended Skills

Install these Claude Code skills for AI-assisted development:

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices -g -y  # React and Next.js patterns from Vercel Engineering
npx skills add tenequm/claude-plugins@shadcn-tailwind -g -y  # Tailwind CSS and shadcn/ui component patterns
npx skills add anthropics/skills@supabase -g -y  # Supabase best practices: RLS, auth, real-time
npx skills add binjuhor/shadcn-lar@frontend-design-pro -g -y  # Professional UI/UX design patterns
npx skills add anthropics/skills@testing-patterns -g -y  # Test writing patterns for frontend and backend
```

- **React Best Practices**: React and Next.js patterns from Vercel Engineering — Your project uses React/Next.js
- **Tailwind + shadcn/ui**: Tailwind CSS and shadcn/ui component patterns — Your project uses Tailwind + shadcn
- **Supabase Patterns**: Supabase best practices: RLS, auth, real-time — Your project uses Supabase
- **Frontend Design Pro**: Professional UI/UX design patterns — Helps create polished, professional interfaces
- **Testing Patterns**: Test writing patterns for frontend and backend — Every production app needs tests
