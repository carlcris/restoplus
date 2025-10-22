'use client';

import { Provider } from 'urql';
import { urqlClient } from '@/lib/graphql/client';

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={urqlClient}>{children}</Provider>;
}
