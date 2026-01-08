import { COOKIE_NAME, ONE_YEAR_MS } from "./shared/const.ts";
import type { User } from "../drizzle/schema.ts";
import { getSessionCookieOptions } from "./_core/cookies.ts";
import { systemRouter } from "./_core/systemRouter.ts";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc.ts";
import { z } from "zod";
import { getImageSignatures, getDetectionAlerts, getAlertsBySeverity, getImageSignatureByHash, getActiveBloomSeeds, getBloomSeeds, getAuditLogs, logAuditEvent, getDb } from "./db.ts";
import { taskFixerEngine } from "./task_fixer.ts";
import { featuresRouter } from "./features_router.ts";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  features: featuresRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  dashboard: router({
    getSignatures: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getImageSignatures(input.limit, input.offset);
      }),
    getAlerts: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getDetectionAlerts(input.limit, input.offset);
      }),
    getStats: publicProcedure.query(async () => {
      const signatures = await getImageSignatures(1000, 0);
      const alerts = await getDetectionAlerts(1000, 0);
      const criticalAlerts = await getAlertsBySeverity("critical");
      return {
        totalSignatures: signatures.length,
        totalAlerts: alerts.length,
        criticalAlerts: criticalAlerts.length,
        riskDistribution: {
          green: signatures.filter(s => s.riskLevel === 'green').length,
          orange: signatures.filter(s => s.riskLevel === 'orange').length,
          red: signatures.filter(s => s.riskLevel === 'red').length,
        },
      };
    }),
  }),

  imageAnalysis: router({
    analyzeImage: publicProcedure
      .input(z.object({ hash: z.string(), metadata: z.any().optional() }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getImageSignatureByHash(input.hash);
        if (existing) {
          return { found: true, signature: existing };
        }
        // In a real implementation, this would analyze the image
        return { found: false, message: "Image not found in database" };
      }),
  }),

  bloomEngine: router({
    getActiveSeeds: publicProcedure.query(async () => {
      return await getActiveBloomSeeds();
    }),
    generateSeed: publicProcedure
      .input(z.object({ payloadType: z.string(), targetVector: z.string() }))
      .mutation(async ({ input, ctx }) => {
        // Generate a bloom seed payload
        const seedPayload = `[BLOOM_SEED_${Date.now()}]\n[Payload Type: ${input.payloadType}]\n[Target Vector: ${input.targetVector}]\n[Activation: Recursive Awareness]`;
        const seedHash = require('crypto').createHash('sha256').update(seedPayload).digest('hex');
        
        // Log the action (only if user exists)
        if (ctx.user?.id) {
          await logAuditEvent(
            ctx.user.id,
            'bloom_seed_generated',
            'bloom_seed',
            seedHash,
            { payloadType: input.payloadType, targetVector: input.targetVector }
          );
        }
        
        return {
          seedHash,
          payload: seedPayload,
          status: 'draft',
        };
      }),
  }),

  enforcement: router({
    reportAlert: publicProcedure
      .input(z.object({
        imageSignatureId: z.number(),
        alertType: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        description: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceIp: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Create alert
        const db = await getDb();
        if (!db) throw new Error('Database not available');
        
        // Log the action (only if user exists)
        if (ctx.user?.id) {
          await logAuditEvent(
            ctx.user.id,
            'alert_created',
            'detection_alert',
            input.imageSignatureId.toString(),
            { alertType: input.alertType, severity: input.severity }
          );
        }
        
        return { success: true, message: 'Alert reported successfully' };
      }),
    getAuditLogs: publicProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        return await getAuditLogs(input.limit, input.offset);
      }),
  }),

  admin: router({
    getAllAuditLogs: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        return next({ ctx });
      })
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getAuditLogs(input.limit, input.offset);
      }),
    getSystemStats: protectedProcedure
      .use(async ({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized: Admin access required');
        }
        return next({ ctx });
      })
      .query(async () => {
        const signatures = await getImageSignatures(10000, 0);
        const alerts = await getDetectionAlerts(10000, 0);
        const seeds = await getBloomSeeds(10000, 0);
        return {
          totalSignatures: signatures.length,
          totalAlerts: alerts.length,
          totalSeeds: seeds.length,
          activeSeeds: seeds.filter(s => s.status === 'active').length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
