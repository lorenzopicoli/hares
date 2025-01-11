import { Stack, Modal, Title, Text, Notification } from '@mantine/core'
import QuickAccessGrid from './QuickAccessGrid'
import SurveyFlow from './SurveyFlow'
import SurveyList from './SurveyList'
import React, { useState } from 'react'
import type { Habit, HabitLog, Survey } from './types'
import { IconCheck } from '@tabler/icons-react'
import { useLocalStorage } from '@mantine/hooks'

function Track() {
  const [logs, setLogs] = useLocalStorage<HabitLog[]>({
    key: 'logs',
    defaultValue: [],
  })
  const [habits, setHabits] = useLocalStorage<Habit[]>({
    key: 'habits',
    defaultValue: [],
  })
  const [surveys, _setSurveys] = useLocalStorage<Survey[]>({
    key: 'surveys',
    defaultValue: [],
  })
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null)

  // Filter for quick access items only
  const quickAccessHabits = habits.filter((h) => h.isPinned)
  const quickAccessSurveys = surveys.filter((s) => s.isPinned)

  const logHabits = (data: HabitLog[]) => {
    setLogs([...logs, ...data])
    setShowSuccessNotification(true)
    setTimeout(() => setShowSuccessNotification(false), 3000)
  }

  const [showSuccessNotification, setShowSuccessNotification] = useState(false)

  return (
    <Stack>
      <Text size="xl">Quick Access</Text>

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

      {quickAccessHabits.length > 0 && (
        <QuickAccessGrid
          habits={habits}
          onTogglePin={(habitId) => {
            setHabits(
              habits.map((h) =>
                h.id === habitId ? { ...h, isPinned: !h.isPinned } : h
              )
            )
          }}
          onLog={(log) => logHabits([log])}
        />
      )}

      {quickAccessSurveys.length > 0 && (
        <>
          <SurveyList
            surveys={quickAccessSurveys}
            onStartSurvey={(surveyId) => {
              const survey = surveys.find((s) => s.id === surveyId)
              if (survey) {
                setActiveSurvey(survey)
              }
            }}
          />
        </>
      )}

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
    </Stack>
  )
}

export default Track
