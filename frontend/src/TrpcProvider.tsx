import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState, useMemo } from 'react'
import { trpc } from './api/trpc'
import { useLocalStorage } from '@mantine/hooks'

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [serverUrl] = useLocalStorage<string>({
    key: 'serverUrl',
    defaultValue: 'http://nourl.blaaaaa',
  })
  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: serverUrl ? `${serverUrl}/trpc` : 'http://nourl.blaaaa',
          async headers() {
            return {}
          },
        }),
      ],
    })
  }, [serverUrl])

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
