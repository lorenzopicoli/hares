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
  ActionIcon,
  FileButton,
  Modal,
  PasswordInput,
} from '@mantine/core'
import {
  IconCloud,
  IconCloudOff,
  IconDownload,
  IconUpload,
  IconTrash,
} from '@tabler/icons-react'
import { useConnection } from './useConnection'
import { useDB } from './useDb'
import { v4 as uuidv4 } from 'uuid'
import { useLocalStorage } from '@mantine/hooks'
import PouchDB from 'pouchdb-browser'

export function Settings() {
  const [deviceId, setDeviceId] = useLocalStorage<string>({
    key: 'deviceId',
    defaultValue: uuidv4(),
  })

  const [serverHost, setServerHost] = useLocalStorage<string>({
    key: 'serverHost',
    defaultValue: '',
  })

  const [username, setUsername] = useLocalStorage<string>({
    key: 'dbUsername',
    defaultValue: '',
  })

  const [password, setPassword] = useLocalStorage<string>({
    key: 'dbPassword',
    defaultValue: '',
  })

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    message: string
    action: () => void
  } | null>(null)

  const { isConnected, isCheckingConnection } = useConnection()
  const { db } = useDB()

  const handleServerUrlChange = async (url: string) => {
    try {
      let validUrl = url
      if (url && !url.startsWith('http')) {
        validUrl = `http://${url}`
      }
      setServerHost(validUrl)
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
      'This will remove all local data. Are you sure you want to continue?',
      async () => {
        try {
          await db.destroy()
          localStorage.clear()
          window.location.reload()
        } catch (error) {
          console.error('Error clearing cache:', error)
        }
      }
    )
  }

  const handleExportData = async () => {
    try {
      const allDocs = await db.allDocs({ include_docs: true })
      const data = allDocs.rows.map((row) => row.doc)
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hares-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const handleImportData = async (file: File | null) => {
    if (!file) return

    showConfirmDialog(
      'Import Data',
      'This will replace all existing data. Are you sure you want to continue?',
      async () => {
        try {
          const content = await file.text()
          const data = JSON.parse(content)
          await db.destroy()
          const newDb = new PouchDB('hares_db')
          for (const doc of data) {
            await newDb.put(doc)
          }
          window.location.reload()
        } catch (error) {
          console.error('Error importing data:', error)
        }
      }
    )
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl">Settings</Text>
        <Tooltip
          label={
            isConnected
              ? 'Connected to server'
              : 'Connect to a server to enable sync'
          }
        >
          <Badge
            color={isConnected ? 'green' : 'red'}
            leftSection={
              isConnected ? <IconCloud size={16} /> : <IconCloudOff size={16} />
            }
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </Tooltip>
      </Group>

      {/* Server Connection */}
      <Paper p="md" withBorder>
        <Stack>
          <Text fw={500}>Server Connection</Text>
          <TextInput
            label="Server URL"
            placeholder="http://localhost:5984"
            value={serverHost}
            onChange={(e) => handleServerUrlChange(e.currentTarget.value)}
            rightSection={
              isCheckingConnection ? (
                <ActionIcon loading variant="transparent" />
              ) : isConnected ? (
                <IconCloud size={20} color="var(--mantine-color-green-6)" />
              ) : (
                <IconCloudOff size={20} color="var(--mantine-color-red-6)" />
              )
            }
          />
          <TextInput
            label="Username"
            placeholder="Enter database username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter database password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
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
              onClick={handleClearCache}
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
