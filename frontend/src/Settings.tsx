import React, { useState } from 'react'
import {
  Paper,
  TextInput,
  Button,
  Stack,
  Text,
  Group,
  Badge,
  Tooltip,
} from '@mantine/core'
import { IconRefresh, IconCloud, IconCloudOff } from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import { useConnection } from './useConnection'
import { useLocalStorage } from '@mantine/hooks'

export function Settings() {
  // Get or generate device ID

  const [deviceId] = useLocalStorage<string>({
    key: 'deviceId',
    defaultValue: uuidv4(),
  })

  const [serverUrl, setServerUrl] = useLocalStorage<string>({
    key: 'serverUrl',
    defaultValue: '',
  })

  const [isSaving, setIsSaving] = useState(false)

  // Use our connection hook
  const { isConnected, isCheckingConnection } = useConnection()

  // Save URL with validation
  const handleServerUrlChange = async (url: string) => {
    setIsSaving(true)
    try {
      // Ensure URL is valid and has protocol
      let validUrl = url
      if (url && !url.startsWith('http')) {
        validUrl = `http://${url}`
      }

      // Save to localStorage
      setServerUrl(validUrl)

      //   window.dispatchEvent(new Event('storage'))

      // We don't need to do anything else as useConnection
      // will automatically detect the change and update the connection status
    } catch (error) {
      console.error('Error saving server URL:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle sync button click
  const handleSync = async () => {
    setIsSaving(true)
    try {
      // Here we'll add sync logic later
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Temporary for UI feedback
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl">Settings</Text>
        <Tooltip
          label={
            isConnected
              ? 'Sync with server'
              : 'Connect to a server to enable sync'
          }
        >
          <Button
            variant="subtle"
            onClick={handleSync}
            disabled={!isConnected}
            loading={isSaving}
            leftSection={
              isConnected ? <IconCloud size={20} /> : <IconCloudOff size={20} />
            }
          >
            Sync Now
          </Button>
        </Tooltip>
      </Group>

      <Paper p="md" withBorder>
        <Stack>
          <TextInput
            label="Server URL"
            placeholder="http://localhost:3010"
            value={serverUrl}
            onChange={(e) => handleServerUrlChange(e.currentTarget.value)}
            rightSection={
              isSaving || isCheckingConnection ? (
                <IconRefresh size={20} className="animate-spin" />
              ) : isConnected ? (
                <IconCloud size={20} color="var(--mantine-color-green-6)" />
              ) : (
                <IconCloudOff size={20} color="var(--mantine-color-red-6)" />
              )
            }
          />

          <Group>
            <Text size="sm" fw={500}>
              Connection Status:
            </Text>
            {isSaving || isCheckingConnection ? (
              <Badge color="yellow">Checking...</Badge>
            ) : isConnected ? (
              <Badge color="green">Connected</Badge>
            ) : (
              <Badge color="red">Disconnected</Badge>
            )}
          </Group>

          <Text size="sm" fw={500}>
            Device ID:{' '}
            <Text span c="dimmed">
              {deviceId}
            </Text>
          </Text>
        </Stack>
      </Paper>
    </Stack>
  )
}
