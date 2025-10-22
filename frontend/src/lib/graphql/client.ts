import { cacheExchange, createClient, fetchExchange, ssrExchange } from 'urql';

const isServerSide = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServerSide });

export const createUrqlClient = () => {
  return createClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
    exchanges: [cacheExchange, ssrCache, fetchExchange],
    fetchOptions: () => {
      return {
        headers: {
          // Add authorization headers here if needed
        },
      };
    },
  });
};

export const urqlClient = createUrqlClient();
