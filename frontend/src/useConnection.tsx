import { useState, useEffect } from 'react'
import { trpc } from './api/trpc'
import { useLocalStorage } from '@mantine/hooks'

export function useConnection() {
  const [isConnected, setIsConnected] = useState(false)

  const [serverUrl] = useLocalStorage<string>({
    key: 'serverUrl',
    defaultValue: '',
  })
  const [deviceId] = useLocalStorage<string>({
    key: 'deviceId',
    defaultValue: '',
  })
  // Check server connection only if we have a server URL
  const { data, isLoading } = trpc.health.useQuery(
    { deviceId },
    {
      queryKeyHashFn: () => serverUrl,
      // Refresh connection status every 30 seconds
      refetchInterval: 30000,
      // Only enable if we have a server URL
      enabled: !!serverUrl,
    }
  )

  useEffect(() => {
    if (data?.status === 'ok') {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }, [data])

  return {
    isConnected,
    isCheckingConnection: isLoading,
    serverUrl,
    deviceId,
  }
}
