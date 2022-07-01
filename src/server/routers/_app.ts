/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import { postRouter } from './post';
//import { messageRouter } from './message';
import superjson from 'superjson';
import { messageRouter } from './message';

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
  .merge('post.', postRouter)
  .merge('message.', messageRouter);

export type AppRouter = typeof appRouter;
