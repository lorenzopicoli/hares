import React, { useState, useEffect } from 'react'
import {
  AppShell,
  Text,
  Button,
  Stack,
  ColorSchemeScript,
  Modal,
  Group,
  Paper,
  ScrollArea,
  Burger,
  rem,
  Notification,
  Divider,
  Title,
  ActionIcon,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconPlus,
  IconList,
  IconSettings,
  IconChartBar,
  IconCheck,
  IconHistory,
  IconTrash,
} from '@tabler/icons-react'
import AddSurveyForm from './AddSurveyForm'
import type { Habit, HabitLog, Survey } from './types'
import AddHabitForm from './AddHabitForm'
import HabitCard from './HabitCard'
import SurveyFlow from './SurveyFlow'
import SurveyList from './SurveyList'
import LogsView from './LogsView'

// Local Storage helpers
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const getFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Default habits
const defaultHabits: Habit[] = [
  {
    id: '1',
    question: 'How many showers did you take?',
    type: 'number',
  },
  {
    id: '2',
    question: 'What is your brain fog score?',
    type: 'scale',
  },
]

function Home() {
  const [habits, setHabits] = useState<Habit[]>(
    () => getFromLocalStorage('habits') || defaultHabits
  )
  const [logs, setLogs] = useState<HabitLog[]>(
    () => getFromLocalStorage('logs') || []
  )
  const [surveys, setSurveys] = useState<Survey[]>(
    () => getFromLocalStorage('surveys') || []
  )
  const [sideBarOpened, { toggle: toggleSidebar }] = useDisclosure()
  const [habitModalOpened, { open: openHabitModal, close: closeHabitModal }] =
    useDisclosure(false)
  const [
    surveyModalOpened,
    { open: openSurveyModal, close: closeSurveyModal },
  ] = useDisclosure(false)
  const [activeTab, setActiveTab] = useState<string>('track')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null)

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage('habits', habits)
  }, [habits])

  useEffect(() => {
    saveToLocalStorage('logs', logs)
  }, [logs])

  useEffect(() => {
    saveToLocalStorage('surveys', surveys)
  }, [surveys])

  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
    }
    setHabits([...habits, newHabit])
  }

  const deleteHabit = (habitId: string) => {
    // Remove habit from habits list
    setHabits(habits.filter((h) => h.id !== habitId))

    // Remove habit from all surveys
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

  const deleteLog = (timestamp: number) => {
    setLogs(logs.filter((log) => log.timestamp !== timestamp))
  }

  const changeTab = (tab: string) => {
    setActiveTab(tab)
    toggleSidebar()
  }

  const addSurvey = (name: string, habitIds: string[]) => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      name,
      habits: habitIds,
    }
    setSurveys([...surveys, newSurvey])
  }

  const logHabits = (data: HabitLog[]) => {
    setLogs([...logs, ...data])
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  return (
    <>
      <ColorSchemeScript />
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !sideBarOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={sideBarOpened}
              onClick={toggleSidebar}
              hiddenFrom="sm"
              size="sm"
            />
            <Text>🐰 Hares</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap="sm">
            <Button
              leftSection={<IconPlus size={20} />}
              fullWidth
              variant={activeTab === 'track' ? 'filled' : 'subtle'}
              onClick={() => changeTab('track')}
              justify="start"
            >
              Track
            </Button>

            <Button
              leftSection={<IconList size={20} />}
              fullWidth
              variant={activeTab === 'habits' ? 'filled' : 'subtle'}
              onClick={() => changeTab('habits')}
              justify="start"
            >
              Habits
            </Button>

            <Button
              leftSection={<IconHistory size={20} />}
              fullWidth
              variant={activeTab === 'logs' ? 'filled' : 'subtle'}
              onClick={() => changeTab('logs')}
              justify="start"
            >
              Logs
            </Button>

            <Button
              leftSection={<IconChartBar size={20} />}
              fullWidth
              variant={activeTab === 'stats' ? 'filled' : 'subtle'}
              onClick={() => changeTab('stats')}
              justify="start"
            >
              Stats
            </Button>

            <Button
              leftSection={<IconSettings size={20} />}
              fullWidth
              variant={activeTab === 'settings' ? 'filled' : 'subtle'}
              onClick={() => changeTab('settings')}
              justify="start"
            >
              Settings
            </Button>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <ScrollArea h={`calc(100vh - ${rem(60)})`} pb={'md'}>
            {activeTab === 'track' && (
              <Stack>
                <Text size="xl">Track Habits</Text>

                {/* Active Survey Modal */}
                <Modal
                  opened={!!activeSurvey}
                  onClose={() => setActiveSurvey(null)}
                  size="xl"
                  padding="xl"
                  withinPortal
                  fullScreen
                >
                  {activeSurvey && (
                    <SurveyFlow
                      survey={activeSurvey}
                      habits={habits}
                      onComplete={(responses) => {
                        logHabits(responses)
                        setActiveSurvey(null)
                      }}
                      onClose={() => setActiveSurvey(null)}
                    />
                  )}
                </Modal>

                {/* Surveys Section */}
                {surveys.length > 0 && (
                  <>
                    <Title order={2} size="h3">
                      Surveys
                    </Title>
                    <SurveyList
                      surveys={surveys}
                      onStartSurvey={(surveyId) => {
                        const survey = surveys.find((s) => s.id === surveyId)
                        if (survey) {
                          setActiveSurvey(survey)
                        }
                      }}
                    />
                    <Divider my="md" />
                  </>
                )}

                {/* Individual Habits Section */}
                <Title order={2} size="h3">
                  Individual Habits
                </Title>
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onLog={(log) => logHabits([log])}
                  />
                ))}
              </Stack>
            )}

            {activeTab === 'logs' && (
              <LogsView logs={logs} habits={habits} onDeleteLog={deleteLog} />
            )}

            {activeTab === 'habits' && (
              <Stack>
                <Group justify="space-between">
                  <Text size="xl">Manage Habits & Surveys</Text>
                  <Group>
                    <Button onClick={openHabitModal}>Add Habit</Button>
                    <Button onClick={openSurveyModal}>Create Survey</Button>
                  </Group>
                </Group>

                {/* Surveys List */}
                {surveys.length > 0 && (
                  <>
                    <Title order={2} size="h3">
                      Surveys
                    </Title>
                    {surveys.map((survey) => (
                      <Paper key={survey.id} p="md" withBorder>
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Text fw={500}>{survey.name}</Text>
                            <Text size="sm" color="dimmed">
                              Habits: {survey.habits.length}
                            </Text>
                          </div>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => deleteSurvey(survey.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    ))}
                    <Divider my="md" />
                  </>
                )}

                {/* Habits List */}
                <Title order={2} size="h3">
                  Habits
                </Title>
                {habits.map((habit) => (
                  <Paper key={habit.id} p="md" withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Text>{habit.question}</Text>
                        <Text size="sm" color="dimmed">
                          Type: {habit.type}
                        </Text>
                      </div>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </ScrollArea>
        </AppShell.Main>

        {/* Success Notification */}
        {showSuccessNotification && (
          <Notification
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
            icon={<IconCheck size={20} />}
            color="green"
            title="Success"
            onClose={() => setShowSuccessNotification(false)}
          >
            Habit logged successfully!
          </Notification>
        )}

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
      </AppShell>
    </>
  )
}

export default Home
