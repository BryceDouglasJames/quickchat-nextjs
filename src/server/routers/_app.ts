/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { postRouter } from './post';
import superjson from 'superjson';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .query('healthz', {
    async resolve() {
      return 'yay!';
    },
  })
  .merge('post.', postRouter);

export type AppRouter = typeof appRouter;
