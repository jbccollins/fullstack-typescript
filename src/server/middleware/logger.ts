import { MyContext } from "@server/resolvers/types";
import { MiddlewareFn } from "type-graphql";

export const logger: MiddlewareFn<MyContext> = async (
  { root, args, context, info },
  next,
) => {
  console.log("[args]", args);
  return next();
};