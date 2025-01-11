import { Stack, Modal, Text, Notification } from '@mantine/core'
import QuickAccessGrid from './QuickAccessGrid'
import SurveyFlow from './SurveyFlow'
import SurveyList from './SurveyList'
import React, { useState } from 'react'
import type { HabitLog, Survey } from './types'
import { IconCheck } from '@tabler/icons-react'
import { useSync } from './useSync'
import { useConnection } from './useConnection'

function Track() {
  const { habits, surveys, addLog } = useSync()
  const { isConnected } = useConnection()
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null)

  // Filter for quick access items only
  const quickAccessHabits = habits.filter((h) => h.isPinned)
  const quickAccessSurveys = surveys.filter((s) => s.isPinned)

  const logHabits = (data: Omit<HabitLog, 'id'>[]) => {
    data.map(addLog)
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
            // setHabits(
            //   habits.map((h) =>
            //     h.id === habitId ? { ...h, isPinned: !h.isPinned } : h
            //   )
            // )
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
          color={isConnected ? 'green' : 'yellow'}
          title="Success"
          onClose={() => setShowSuccessNotification(false)}
        >
          {isConnected
            ? 'Habit logged successfully!'
            : 'Habit stored locally. Connect to a server to sync'}
        </Notification>
      )}
    </Stack>
  )
}

export default Track
