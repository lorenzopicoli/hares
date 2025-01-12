import { Stack, Modal, Text, Notification } from '@mantine/core'
import QuickAccessGrid from './QuickAccessGrid'
import SurveyFlow from './SurveyFlow'
import SurveyList from './SurveyList'
import React, { useState } from 'react'
import type { HabitLog, Survey } from './types'
import { IconCloudOff, IconCloud } from '@tabler/icons-react'
import { useSync } from './useSync'
import { useConnection } from './useConnection'
import type { SurveyDoc } from './useDb'

function Track() {
  const { habits, surveys, addLog } = useSync()
  const { isConnected } = useConnection()
  const [activeSurvey, setActiveSurvey] = useState<SurveyDoc | null>(null)
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
    type: 'success' | 'warning'
  }>({ show: false, message: '', type: 'success' })

  // Filter for quick access items only
  const quickAccessHabits = habits.filter((h) => h.isPinned)
  const quickAccessSurveys = surveys.filter((s) => s.isPinned)

  const logHabits = (data: Omit<HabitLog, 'id'>[]) => {
    Promise.all(data.map(addLog)).then(() => {
      showNotification(
        isConnected
          ? 'Habit logged and synced!'
          : 'Habit stored locally (offline mode)',
        isConnected ? 'success' : 'warning'
      )
    })
  }

  const showNotification = (message: string, type: 'success' | 'warning') => {
    setNotification({ show: true, message, type })
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    )
  }

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
              const survey = surveys.find((s) => s._id === surveyId)
              if (survey) {
                setActiveSurvey(survey)
              }
            }}
          />
        </>
      )}

      {/* Success Notification */}
      {notification.show && (
        <Notification
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          icon={
            notification.type === 'success' ? (
              <IconCloud size={20} />
            ) : (
              <IconCloudOff size={20} />
            )
          }
          color={notification.type === 'success' ? 'green' : 'yellow'}
          title={notification.type === 'success' ? 'Success' : 'Offline Mode'}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        >
          {notification.message}
        </Notification>
      )}
    </Stack>
  )
}

export default Track
