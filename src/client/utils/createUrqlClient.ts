import {
  LoginMutation,
  MeQuery,
  MeDocument,
  LogoutMutation,
  RegisterMutation,
  ChangePasswordMutation,
} from '@client/generated/graphql';
import { devtoolsExchange } from '@urql/devtools';
import { Client, createClient, dedupExchange, /* Exchange, */ fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { betterUpdateQuery } from '@client/utils/betterUpdateQuery';
// import { pipe, tap } from 'wonka';
// import history from '@client/utils/history';

// const errorExchange: Exchange =
//   ({ forward }) =>
//   (ops$) => {
//     return pipe(
//       forward(ops$),
//       tap(({ error }) => {
//         // TODO: Make "Not logged in a shared constant";
//         // This should only really ever be hit if the user's session times out.
//         // Most of the time this should be handled by the PrivateRoute component
//         if (error?.message.includes('Not logged in')) {
//           history.replace('/login'); // history.push instead maybe?
//           console.log(error);
//         }
//       })
//     );
//   };

export const createUrqlClient = (): Client => {
  return createClient({
    url: 'http://localhost:3000/graphql',
    fetchOptions: {
      credentials: 'include',
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            // These keys must match up with the names of the mutations
            loginUser: (_result: LoginMutation, _args, cache, _info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                if (result.loginUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.loginUser.user,
                  };
                }
              });
            },
            logoutUser: (_result: LogoutMutation, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(cache, { query: MeDocument }, _result, () => {
                // Always clear the current user from the cache regardless of success or fail
                return { me: null };
              });
            },
            registerUser: (_result: RegisterMutation, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(cache, { query: MeDocument }, _result, (result, query) => {
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.registerUser.user,
                  };
                }
              });
            },
            changePassword: (_result: ChangePasswordMutation, _args, cache, _info) => {
              betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.changePassword.errors) {
                    return query;
                  } else {
                    return {
                      me: result.changePassword.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      //errorExchange,
      fetchExchange,
    ],
  });
};
