import { Cache, QueryInput } from '@urql/exchange-graphcache';
export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: unknown,
  fn: (r: Result, q: Query) => Query
): void {
  return cache.updateQuery(qi, (data) => fn(result as any, data as any) as any);
}
