'use client';

import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '@/server/trpc';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <html lang="en">
      <head>
        <title>tRPC Learning App</title>
        <meta name="description" content="Learn tRPC step by step" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
} 