# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Home Cloud application - a personal (LAN) cloud storage/media management system built as a
hybrid Electron + Next.js application. It manages photos, videos, music and other files with a
modern tech stack. The app is designed to run natively on a desktop computer and turn "root folders"
the user can add into a local-cloud media server. Since the advantages of a server don't apply (SEO
etc.), we use a SPA that is created by next's "export" mode. This way we still benefit from the
0conf setup, bundling, ecosystem and automatic code-splitting that nextjs provides while building a
SPA. Additionaly, although it is primarily a native app, we also want to be able to access the media
from other local devices preferably with the same UX. The SPA allows us to simply do that from any
browser by hosting the static files + API as a nodejs server from inside the electron app. To keep
it simple, we also load from that server in electron for the native app instead of building
something custom.

## Essential Commands

### Development

- `npm run dev` - Run full Electron app in development
- `npm run next-dev` - Run Next.js app only (with Turbo)
- `npm run server-dev` - Run backend server only

### Testing

- `npm test` - Run tests with Vitest
- To run a specific test file: `npm test src/backend/manager/fs.test.ts`

### Build & Validation

- `npm run typecheck` - TypeScript type checking
- `npm run lint` - ESLint with auto-fix
- `npm run format` - Prettier formatting
- `npm run build` - Type check and build Electron app
- `npm run build:mac` - Build for macOS
- `npm run build:win` - Build for Windows
- `npm run build:linux` - Build for Linux

## Architecture

### Tech Stack

- **Frontend**: React 19, Next.js 15 (static export), Tailwind CSS v4, shadcn/ui components
- **Backend**: tRPC API, Fastify server, SQLite with Drizzle ORM
- **Desktop**: Electron wrapper serving the static Next.js build
- **Media Processing**: fluent-ffmpeg for video handling
- **State Management**: Zustand, React Query (Tanstack Query)

### Key Directories

- `/app` - Next.js app with (dashboard) and (viewer) layouts
- `/components` - React components using shadcn/ui
- `/src/backend` - Server-side logic:
  - `routers/` - tRPC routers for files, photos, videos, API
  - `database/` - SQLite database management with Drizzle
  - `manager/` - File system operations and media handling
- `/src/main` - Electron main process
- `/src/renderer` - Electron renderer (separate from Next.js)
- `/lib` - Utility functions and custom React hooks
- `/drizzle` - Database migrations and schema

### Database

- SQLite database at `database.db`
- Schema defined in `src/backend/database/schema.ts`
- Migrations in `/drizzle` directory

### API Structure

The app uses tRPC for type-safe API calls between frontend and backend:

- Files API: File management operations
- Photos API: Photo-specific operations
- Videos API: Video processing and metadata
- General API: System operations

## Code Conventions

- Use existing UI components from `/components/ui` (shadcn/ui)
- Follow TypeScript strict mode conventions
- Use absolute imports with @ prefix (configured in tsconfig)
- Media file type classifications are defined in `src/backend/manager/fs.ts`
- Test files use Vitest with `.test.ts` extension

### React Best Practices

- **Avoid unnecessary effects**: Calculate derived state during render instead of using `useEffect` (see [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect))
- **Don't use refs for derived state**: If a value can be calculated from props/state, calculate it during render
- **Effects are for synchronization**: Use effects only for synchronizing with external systems, not for transforming data
- **Prefer composition over effects**: When possible, express logic through component composition and state updates

### TypeScript Best Practices

- **Avoid `any` types**: Use `unknown` or specific types instead
- **Use const assertions**: For literal types and readonly arrays/objects
- **Leverage type inference**: Let TypeScript infer types when obvious, be explicit when it adds clarity
- **Use discriminated unions**: For component variants and state machines
- **Export types from modules**: Especially tRPC router input/output types
- **Prefer arrow functions**: For uniformity use arrow functions unless there are good technical reasons not to

### State Management Guidelines

- **Zustand**: Use for global UI state that needs persistence (view preferences, user settings)
- **React Query**: Use for ALL server state - never store server data in Zustand or useState
- **URL state**: Use for shareable/bookmarkable state (search, filters, pagination)
- **Local state**: Use for ephemeral component state (form inputs, UI toggles)
- **Refs**: Use for values that don't trigger re-renders (DOM refs, timers, previous values)

### Component Design Principles

- **Single Responsibility**: Each component should do one thing well
- **Compound Components**: Use for complex UI patterns (see FilesTable example)
- **Custom Hooks**: Extract complex logic, especially when it uses other hooks
- **Presentation vs Container**: Keep components focused on UI, move data logic to hooks
- **Props Interface**: Define explicit interfaces for component props, avoid inline types
- **Tailwind Patterns**: Use modern Tailwind best practices for styling
