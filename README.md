# karo.vision

Personal portfolio and project showcase repository, featuring both the portfolio website and the actual code for various projects.

## Monorepo Structure

This repository uses a monorepo architecture with workspaces managed by Bun. The structure separates deliverable applications from reusable, isolated packages.

```
karo.vision/
├── apps/            # Deliverable applications
└── packages/        # Reusable, isolated components
```

### Apps

Applications are complete, deployable projects that can be run independently:

- **`web`** - Portfolio website built with Next.js 16 and React 19
  - Personal portfolio showcasing projects and experience
  - Modern stack: Tailwind CSS v4, shadcn/ui components
  - Optimized static site generation

- **`web-api`** - Backend API server for the portfolio site

- **`home-cloud-desktop`** - Personal cloud storage desktop application
  - Hybrid Electron + Next.js application
  - Local media management system (photos, videos, music)
  - See [CLAUDE.md](./CLAUDE.md) for detailed architecture

- **`home-cloud-headless`** - Headless version of Home Cloud for server deployments

### Packages

Shared packages contain reusable code and configurations that can be consumed by multiple apps:

- **`home-cloud-frontend`** - React frontend components for Home Cloud
  - Next.js 16 with React 19
  - tRPC client integration
  - Shared UI components and state management

- **`home-cloud-backend`** - Backend logic for Home Cloud
  - tRPC API routers
  - SQLite database with Drizzle ORM
  - File system management and media processing

- **`home-cloud-config`** - Shared configuration and types
  - ESLint and TypeScript configurations
  - Common type definitions

## Tech Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS v4, shadcn/ui
- **Backend**: tRPC, Fastify, SQLite, Drizzle ORM
- **Desktop**: Electron
- **Runtime**: Bun
- **Languages**: TypeScript
- **State Management**: Zustand, React Query (Tanstack Query)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher

### Installation

```bash
bun install
```

### Development

Run specific applications:

```bash
# Portfolio website + API
bun run dev-web

# Home Cloud application
bun run dev-home-cloud
```

### Linting

```bash
bun run lint
```

## Project Philosophy

This repository demonstrates modern full-stack development practices:

- **Monorepo benefits**: Shared code, consistent tooling, atomic commits
- **Type safety**: End-to-end TypeScript with tRPC for API type safety
- **Modern React**: React 19 patterns, avoiding unnecessary effects, composition over complexity
- **Performance**: Optimized builds, code splitting, efficient state management
- **Developer experience**: Fast feedback loops with Bun, comprehensive linting and formatting

## Documentation

- [CLAUDE.md](./CLAUDE.md) - Detailed Home Cloud architecture and development guide
- [.editorconfig](./.editorconfig) - Editor configuration for consistent formatting

## License

Private repository - all rights reserved.
