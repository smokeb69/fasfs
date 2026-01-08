import { router, publicProcedure } from './trpc.ts';

export const systemRouter = router({
  // System health and status endpoints
  health: publicProcedure.query(() => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }),

  stats: publicProcedure.query(() => {
    return {
      threatsDetected: 0,
      activeMonitoring: true,
      systemUptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  })
});
