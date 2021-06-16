import { MyContext } from '@server/resolvers/types';
import { MiddlewareFn } from 'type-graphql';
// { root, args, context, info }
export const logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log('[args]', args);
  return next();
};
