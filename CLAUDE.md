# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Home Cloud application - a personal (LAN) cloud storage/media management system built as a hybrid Electron + Next.js application. It manages photos, videos, and files with a modern tech stack.

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
