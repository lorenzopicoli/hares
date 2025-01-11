import React, { useState } from 'react'
import { Grid, Paper, Text, ActionIcon, Group, Modal } from '@mantine/core'
import { IconPin, IconPinnedOff, IconPlus } from '@tabler/icons-react'
import type { Habit, HabitLog } from './types'
import HabitCard from './HabitCard'

interface QuickAccessGridProps {
  habits: Habit[]
  onTogglePin: (habitId: string) => void
  onLog: (log: Omit<HabitLog, 'id'>) => void
}

function QuickAccessGrid({ habits, onTogglePin, onLog }: QuickAccessGridProps) {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)

  const pinnedHabits = habits
    .filter((h) => h.isPinned)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const unpinnedHabits = habits.filter((h) => !h.isPinned)

  return (
    <>
      <Grid gutter="md">
        {pinnedHabits.map((habit) => (
          <Grid.Col key={habit.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper
              p="md"
              withBorder
              className="hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => setSelectedHabit(habit)}
            >
              <Group justify="space-between" mb="xs">
                <Text size="lg" fw={500} lineClamp={2}>
                  {habit.question}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="yellow"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTogglePin(habit.id)
                  }}
                >
                  <IconPinnedOff size={16} />
                </ActionIcon>
              </Group>
              <Text size="sm" c="dimmed">
                Type: {habit.type}
              </Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>

      {/* Logging Modal */}
      <Modal
        opened={!!selectedHabit}
        onClose={() => setSelectedHabit(null)}
        size="lg"
        title={selectedHabit?.question}
      >
        {selectedHabit && (
          <HabitCard
            habit={selectedHabit}
            onLog={(log) => {
              onLog(log)
              setSelectedHabit(null)
            }}
          />
        )}
      </Modal>
    </>
  )
}

export default QuickAccessGrid
