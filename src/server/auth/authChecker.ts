//https://typegraphql.com/docs/authorization.html
// https://github.com/MichalLytek/type-graphql/tree/master/examples/authorization

import { MyContext } from '@server/resolvers/types';
import { AuthChecker, MiddlewareFn } from 'type-graphql';

// This is the built in type-graphql way of doing authorization.
/*
  @Authorized()
  @Mutation(() => UserResponse)
  async logoutUser(
    @Ctx() { orm, req }: MyContext,
  ): Promise<UserResponse> {
    req.session.userId = null;

    return {
      user: null
    };
  }
*/
export const authChecker: AuthChecker<MyContext> = ({ root, args, context, info }, roles) => {
  // here we can read the user from context
  // and check their permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  return !!context.req.session.userId;
};

/****************************************************/

// This is a custom way of doing authorization. It might make sense to move this under the middleware directory
/*
  @UseMiddleware(isAuth)
  @Mutation(() => UserResponse)
  async logoutUser(
    @Ctx() { orm, req }: MyContext,
  ): Promise<UserResponse> {
    req.session.userId = null;

    return {
      user: null
    };
  }
*/
export const isAuth: MiddlewareFn<MyContext> = async ({ root, args, context, info }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Not logged in');
  }
  return next();
};
