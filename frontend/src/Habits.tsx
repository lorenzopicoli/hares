import {
  Stack,
  Group,
  Button,
  Paper,
  ActionIcon,
  Text,
  Modal,
  TextInput,
  Tabs,
} from '@mantine/core'
import { IconTrash, IconPinned, IconPin, IconNotes } from '@tabler/icons-react'
import React, { useState } from 'react'
import type { Habit, Survey, HabitLog } from './types'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import AddHabitForm from './AddHabitForm'
import AddSurveyForm from './AddSurveyForm'
import HabitCard from './HabitCard'

function Habits() {
  const [logs, setLogs] = useLocalStorage<HabitLog[]>({
    key: 'logs',
    defaultValue: [],
  })
  const [habits, setHabits] = useLocalStorage<Habit[]>({
    key: 'habits',
    defaultValue: [],
  })
  const [surveys, setSurveys] = useLocalStorage<Survey[]>({
    key: 'surveys',
    defaultValue: [],
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [activeTab, setActiveTab] = useState<string | null>('habits')

  const [
    surveyModalOpened,
    { open: openSurveyModal, close: closeSurveyModal },
  ] = useDisclosure(false)
  const [habitModalOpened, { open: openHabitModal, close: closeHabitModal }] =
    useDisclosure(false)

  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
    }
    setHabits([...habits, newHabit])
  }

  const addSurvey = (name: string, habitIds: string[]) => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      name,
      habits: habitIds,
      isPinned: false, // Add isPinned property
    }
    setSurveys([...surveys, newSurvey])
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setSurveys(
      surveys.map((survey) => ({
        ...survey,
        habits: survey.habits.filter((id) => id !== habitId),
      }))
    )
  }

  const deleteSurvey = (surveyId: string) => {
    setSurveys(surveys.filter((s) => s.id !== surveyId))
  }

  const toggleHabitPin = (habitId: string) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId ? { ...h, isPinned: !h.isPinned } : h
      )
    )
  }

  const toggleSurveyPin = (surveyId: string) => {
    setSurveys(
      surveys.map((s) =>
        s.id === surveyId ? { ...s, isPinned: !s.isPinned } : s
      )
    )
  }

  const filteredHabits = habits.filter((habit) =>
    habit.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl">Manage Habits & Surveys</Text>
        <Group>
          <Button onClick={openHabitModal}>Add Habit</Button>
          <Button onClick={openSurveyModal}>Create Survey</Button>
        </Group>
      </Group>

      <TextInput
        placeholder="Search habits..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="md"
      />

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="habits">Habits</Tabs.Tab>
          <Tabs.Tab value="surveys">Surveys</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="habits">
          <Stack mt="md">
            {filteredHabits.map((habit) => (
              <Paper key={habit.id} p="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text>{habit.question}</Text>
                    <Text size="sm" c="dimmed">
                      Type: {habit.type}
                    </Text>
                  </Stack>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => setSelectedHabit(habit)}
                      title="Log habit"
                    >
                      <IconNotes size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                      onClick={() => toggleHabitPin(habit.id)}
                      title={
                        habit.isPinned
                          ? 'Remove from quick access'
                          : 'Add to quick access'
                      }
                    >
                      {habit.isPinned ? (
                        <IconPinned size={16} />
                      ) : (
                        <IconPin size={16} />
                      )}
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteHabit(habit.id)}
                      title="Delete habit"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="surveys">
          <Stack mt="md">
            {surveys.map((survey) => (
              <Paper key={survey.id} p="md" withBorder>
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={500}>{survey.name}</Text>
                    <Text size="sm" c="dimmed">
                      Habits: {survey.habits.length}
                    </Text>
                  </div>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                      onClick={() => toggleSurveyPin(survey.id)}
                      title={
                        survey.isPinned
                          ? 'Remove from quick access'
                          : 'Add to quick access'
                      }
                    >
                      {survey.isPinned ? (
                        <IconPinned size={16} />
                      ) : (
                        <IconPin size={16} />
                      )}
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => deleteSurvey(survey.id)}
                      title="Delete survey"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Add Habit Modal */}
      <Modal
        opened={habitModalOpened}
        onClose={closeHabitModal}
        title="Add New Habit"
      >
        <AddHabitForm
          onSubmit={(habit) => {
            addHabit(habit)
            closeHabitModal()
          }}
        />
      </Modal>

      {/* Create Survey Modal */}
      <Modal
        opened={surveyModalOpened}
        onClose={closeSurveyModal}
        title="Create New Survey"
      >
        <AddSurveyForm
          habits={habits}
          onSubmit={(name, habitIds) => {
            addSurvey(name, habitIds)
            closeSurveyModal()
          }}
        />
      </Modal>

      {/* Log Habit Modal */}
      <Modal
        opened={!!selectedHabit}
        onClose={() => setSelectedHabit(null)}
        title="Log Habit"
      >
        {selectedHabit && (
          <HabitCard
            habit={selectedHabit}
            onLog={(log) => {
              setLogs([...logs, log])
              setSelectedHabit(null)
            }}
          />
        )}
      </Modal>
    </Stack>
  )
}

export default Habits
