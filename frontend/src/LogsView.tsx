import React from 'react'
import {
  Stack,
  Text,
  Paper,
  Group,
  ActionIcon,
  ScrollArea,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import type { HabitLog, Habit } from './types'

interface LogsViewProps {
  logs: HabitLog[]
  habits: Habit[]
  onDeleteLog: (logTimestamp: number) => void
}

const LogsView = ({ logs, habits, onDeleteLog }: LogsViewProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getHabitQuestion = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId)
    return habit?.question || 'Unknown Habit'
  }

  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    return value.toString()
  }

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <Stack>
      <Text size="xl">Habit Logs</Text>
      <ScrollArea h="calc(100vh - 180px)">
        <Stack gap="md">
          {sortedLogs.map((log) => (
            <Paper key={log.timestamp} p="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Stack gap="xs">
                  <Text fw={500}>{getHabitQuestion(log.habitId)}</Text>
                  <Group gap="xs">
                    <Text size="sm">Value: {formatValue(log.value)}</Text>
                    {log.recordedTime && (
                      <Text size="sm">Time of day: {log.recordedTime}</Text>
                    )}
                    {log.exactTime && (
                      <Text size="sm">
                        Exact time: {new Date(log.exactTime).toLocaleString()}
                      </Text>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    Logged at: {formatDate(log.timestamp)}
                  </Text>
                </Stack>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onDeleteLog(log.timestamp)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  )
}

export default LogsView
