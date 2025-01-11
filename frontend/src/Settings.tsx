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
  Divider,
  ActionIcon,
  FileButton,
  Modal,
} from '@mantine/core'
import {
  IconRefresh,
  IconCloud,
  IconCloudOff,
  IconDownload,
  IconUpload,
  IconTrash,
} from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid'
import { useConnection } from './useConnection'
import { useLocalStorage } from '@mantine/hooks'
import { useSync } from './useSync'

export function Settings() {
  const [deviceId, setDeviceId] = useLocalStorage<string>({
    key: 'deviceId',
    defaultValue: uuidv4(),
  })

  const [serverUrl, setServerUrl] = useLocalStorage<string>({
    key: 'serverUrl',
    defaultValue: '',
  })
  const { pendingSync, syncPendingItems, lastSyncFailed } = useSync()

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    message: string
    action: () => void
  } | null>(null)

  // Use our connection hook
  const { isConnected, isCheckingConnection } = useConnection()

  const handleServerUrlChange = async (url: string) => {
    try {
      let validUrl = url
      if (url && !url.startsWith('http')) {
        validUrl = `http://${url}`
      }
      setServerUrl(validUrl)
    } catch (error) {
      console.error('Error saving server URL:', error)
    }
  }

  const showConfirmDialog = (
    title: string,
    message: string,
    action: () => void
  ) => {
    setConfirmAction({ title, message, action })
    setConfirmModalOpen(true)
  }

  const handleDeviceIdChange = (newId: string) => {
    showConfirmDialog(
      'Change Device ID',
      'Changing the device ID will reset your data and any pending changes will be lost forever. Are you sure you want to continue?',
      () => setDeviceId(newId)
    )
  }

  const handleClearCache = () => {
    showConfirmDialog(
      'Clear Local Cache',
      "This will remove all local data. Your pending changes won't be lost. Are you sure you want to continue?",
      () => {
        // Function to be implemented
        console.log('Clear cache')
      }
    )
  }

  const handleClearPendingSync = () => {
    showConfirmDialog(
      'Clear Pending Sync',
      'This will remove all pending sync items. They will be gone forever. Are you sure you want to continue?',
      () => {
        // Function to be implemented
        console.log('Clear pending sync')
      }
    )
  }

  const handleExportData = () => {
    // Function to be implemented
    console.log('Export data')
  }

  const handleImportData = (file: File | null) => {
    // Function to be implemented
    console.log('Import data', file)
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
            onClick={syncPendingItems}
            disabled={!isConnected}
            loading={isCheckingConnection}
            leftSection={
              isConnected ? <IconCloud size={20} /> : <IconCloudOff size={20} />
            }
          >
            Sync Now
          </Button>
        </Tooltip>
      </Group>

      {/* Server Connection */}
      <Paper p="md" withBorder>
        <Stack>
          <Text fw={500}>Server Connection</Text>
          <TextInput
            label="Server URL"
            placeholder="http://localhost:3010"
            value={serverUrl}
            onChange={(e) => handleServerUrlChange(e.currentTarget.value)}
            rightSection={
              isCheckingConnection ? (
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
              Status:
            </Text>
            {isCheckingConnection ? (
              <Badge color="yellow">Checking...</Badge>
            ) : isConnected ? (
              <Badge color="green">Connected</Badge>
            ) : (
              <Badge color="red">Disconnected</Badge>
            )}
          </Group>
        </Stack>
      </Paper>

      {/* Sync Status */}
      <Paper p="md" withBorder>
        <Stack>
          <Text fw={500}>Sync Status</Text>
          {lastSyncFailed ? <Badge color="red">Last Sync Failed</Badge> : null}
          <Group>
            <Text size="sm">Pending Items:</Text>
            <Badge color="blue">{pendingSync.habits.length} Habits</Badge>
            <Badge color="violet">{pendingSync.surveys.length} Surveys</Badge>
            <Badge color="green">{pendingSync.logs.length} Logs</Badge>
            <Badge color="grape">
              {Object.keys(pendingSync.habitPins).length +
                Object.keys(pendingSync.surveyPins).length}{' '}
              Others
            </Badge>
          </Group>
          <Button
            variant="light"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => handleClearPendingSync()}
            disabled={
              !pendingSync.habits.length &&
              !pendingSync.surveys.length &&
              !pendingSync.logs.length
            }
          >
            Clear Pending Sync
          </Button>
        </Stack>
      </Paper>

      {/* Device Settings */}
      <Paper p="md" withBorder>
        <Stack>
          <Text fw={500}>Device Settings</Text>
          <TextInput
            label="Device ID"
            value={deviceId}
            onChange={(e) => handleDeviceIdChange(e.currentTarget.value)}
          />
          <Group>
            <FileButton onChange={handleImportData} accept=".json">
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                >
                  Import Data
                </Button>
              )}
            </FileButton>
            <Button
              variant="light"
              leftSection={<IconDownload size={16} />}
              onClick={handleExportData}
            >
              Export Data
            </Button>
            <Button
              variant="light"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => handleClearCache()}
            >
              Clear Cache
            </Button>
          </Group>
        </Stack>
      </Paper>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title={confirmAction?.title}
      >
        <Stack>
          <Text>{confirmAction?.message}</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() => {
                confirmAction?.action()
                setConfirmModalOpen(false)
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
