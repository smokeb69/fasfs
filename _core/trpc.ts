import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error && error.cause.name === 'ZodError'
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // TODO: Add authentication logic here
  return next();
});

// Create context for tRPC
export const createContext = async (opts: any) => {
  return {
    ...opts,
    // Add database connection, user session, etc.
  };
};

// Export type helpers
export type TRPCContext = Awaited<ReturnType<typeof createContext>>;
