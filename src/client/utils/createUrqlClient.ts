import { LoginMutation, MeQuery, MeDocument, LogoutMutation, RegisterMutation } from "@client/generated/graphql";
import { devtoolsExchange } from "@urql/devtools";
import { createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "@utils/betterUpdateQuery";

export const createUrqlClient = () => {return createClient({
  url: 'http://localhost:3000/graphql',
  fetchOptions: {
    credentials: 'include'
  },
  exchanges: [devtoolsExchange, dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        // These keys must match up with the names of the mutations
        loginUser: (_result: LoginMutation, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.loginUser.errors) {
                return query;
              } else {
                return {
                  me: result.loginUser.user
                }
              }
            }
          );
        },
        logoutUser: (_result: LogoutMutation, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            () => {
              // Always clear the current user from the cache regardless of success or fail
              return { me: null }
            }
          );
        },
        registerUser: (_result: RegisterMutation, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            (result, query) => {
              if (result.registerUser.errors) {
                return query;
              } else {
                return {
                  me: result.registerUser.user
                }
              }
            }
          );
        }
      }
    }
  }), fetchExchange],
})};