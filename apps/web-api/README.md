# Web API - RPC-Style Architecture with Elysia

This API follows an **RPC-style (Remote Procedure Call) approach** similar to tRPC, but built with [Elysia](https://elysiajs.com) on [Bun](https://bun.sh). It provides type-safe, composable routes organized by feature/topic.

## Architecture Philosophy

### RPC-Style Design

Like tRPC, this API organizes endpoints by **feature** rather than HTTP semantics. Each feature module (e.g., `waitlist`) contains all related operations in a single file:

- **Queries** (GET requests) - Read operations
- **Mutations** (POST requests) - Write operations

This creates a **procedure-oriented API** where operations are grouped by domain logic, not REST conventions.

### Example Structure

```
Feature: Waitlist
├── Query:    GET    /home-cloud/v1/waitlist/byEmail
├── Mutation: POST   /home-cloud/v1/waitlist/signup
├── Mutation: POST   /home-cloud/v1/waitlist/remove
└── Query:    GET    /home-cloud/v1/waitlist/list
```

All defined in: `routes/home-cloud/v1/waitlist.ts`

## Directory Structure

```
apps/web-api/
├── main.ts                          # Entry point - starts Bun server
├── app.ts                           # Elysia app configuration
├── env.ts                           # Environment config with Zod validation
└── routes/
    ├── index.ts                     # Root router composition
    └── home-cloud/
        ├── index.ts                 # Home Cloud namespace
        └── v1/
            ├── index.ts             # API version 1 composition
            └── waitlist.ts          # Waitlist feature (queries + mutations)
```
