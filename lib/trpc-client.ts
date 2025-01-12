import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/src/backend/server/router";

export const trpc = createTRPCReact<AppRouter>();
