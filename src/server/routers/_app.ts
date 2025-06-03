import { initTRPC } from '@trpc/server';
import { createContext } from '../context';
import { lessonsRouter } from './lessons';

const t = initTRPC.context<typeof createContext>().create();

export const appRouter = t.router({
  lessons: lessonsRouter,
});

export type AppRouter = typeof appRouter; 