import React from 'react'
import {
  Stack,
  Text,
  Paper,
  Group,
  ActionIcon,
  ScrollArea,
  Badge,
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

  const formatValue = (log: HabitLog) => {
    switch (log.valueType) {
      case 'boolean':
        return (log.value as boolean) ? 'Yes' : 'No'
      case 'mood':
      case 'food':
      case 'text_list':
        return (log.value as string[]).join(', ')
      case 'scale':
        return `${log.value}/5`
      default:
        return log.value.toString()
    }
  }

  const getMealTypeBadge = (mealType?: string) => {
    if (!mealType) return null

    const colors = {
      breakfast: 'yellow',
      lunch: 'green',
      dinner: 'blue',
      snack: 'grape',
    }

    return (
      <Badge color={colors[mealType as keyof typeof colors]} variant="light">
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Badge>
    )
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
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Group justify="space-between" align="center">
                    <Text fw={500}>{getHabitQuestion(log.habitId)}</Text>
                    {log.mealType && getMealTypeBadge(log.mealType)}
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Value:{' '}
                      <Text span c="dimmed">
                        {formatValue(log)}
                      </Text>
                    </Text>

                    {log.generalTime && (
                      <Text size="sm" fw={500}>
                        Time of day:{' '}
                        <Text span c="dimmed">
                          {log.generalTime}
                        </Text>
                      </Text>
                    )}
                  </Group>

                  <Group gap="lg">
                    <Text size="sm" fw={500}>
                      Date:{' '}
                      <Text span c="dimmed">
                        {log.date.toLocaleDateString()}
                        {log.isExactTime &&
                          ` at ${new Date(log.date).toLocaleTimeString()}`}
                      </Text>
                    </Text>

                    <Text size="sm" c="dimmed">
                      Logged: {formatDate(log.timestamp)}
                    </Text>
                  </Group>

                  {log.surveyId && (
                    <Text size="sm" c="blue">
                      Part of survey
                    </Text>
                  )}
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
