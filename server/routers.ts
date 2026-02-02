import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers para componentes de PC
  processors: router({
    list: publicProcedure.query(() => db.getAllProcessors()),
    byBrand: publicProcedure
      .input(z.object({ brand: z.string() }))
      .query(({ input }) => db.getProcessorsByBrand(input.brand)),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProcessorById(input.id)),
  }),

  gpus: router({
    list: publicProcedure.query(() => db.getAllGPUs()),
    byBrand: publicProcedure
      .input(z.object({ brand: z.string() }))
      .query(({ input }) => db.getGPUsByBrand(input.brand)),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getGPUById(input.id)),
  }),

  storage: router({
    types: publicProcedure.query(() => db.getAllStorageTypes()),
    typeById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getStorageTypeById(input.id)),
  }),

  configurations: router({
    save: publicProcedure
      .input(
        z.object({
          name: z.string(),
          processorId: z.number().optional(),
          gpuId: z.number().optional(),
          ramType: z.string().optional(),
          ramModules: z.number().default(0),
          storageConfig: z.string().optional(),
          pciExpress1x4: z.number().default(0),
          pciExpress1x8: z.number().default(0),
          pciExpress1x16: z.number().default(0),
          opticalDrives: z.number().default(0),
          fans: z.number().default(0),
          totalWatts: z.number(),
          recommendedPSU: z.number(),
        })
      )
      .mutation(({ input }) => db.saveConfiguration(input)),
    list: publicProcedure.query(() => {
      // Por ahora retornamos todas las configuraciones sin filtrar por usuario
      // En el futuro se puede implementar con protectedProcedure
      return [];
    }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteConfiguration(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
