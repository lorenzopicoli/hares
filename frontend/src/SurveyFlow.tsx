import React, { useState } from 'react'
import {
  Card,
  Button,
  Group,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import type { Habit, HabitLog, Survey } from './types'
import HabitCard from './HabitCard'
import type { HabitDoc, SurveyDoc } from './useDb'

interface SurveyFlowProps {
  survey: SurveyDoc
  habits: HabitDoc[]
  onComplete: (responses: Omit<HabitLog, 'id'>[]) => void
  onClose: () => void
}

function SurveyFlow({ survey, habits, onComplete, onClose }: SurveyFlowProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Omit<HabitLog, 'id'>[]>([])

  const surveyHabits = survey.habits
    .map((id) => habits.find((h) => h._id === id))
    .filter((habit): habit is HabitDoc => habit !== undefined)

  const currentHabit = surveyHabits[currentQuestionIndex]
  const progress = (currentQuestionIndex / surveyHabits.length) * 100

  const handleResponse = (value: Omit<HabitLog, 'id'>) => {
    const newResponses = [...responses, value]

    setResponses(newResponses)

    if (currentQuestionIndex < surveyHabits.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      onComplete(newResponses)
    }
  }

  return (
    <Card p="xl" radius="md" withBorder className="max-w-2xl mx-auto">
      <Stack>
        <Group justify="space-between" mb="md">
          <Title order={2}>{survey.name}</Title>
          <Text size="sm" c="dimmed">
            Question {currentQuestionIndex + 1} of {surveyHabits.length}
          </Text>
        </Group>

        <Progress value={progress} size="sm" mb="xl" />

        {currentHabit && (
          <HabitCard
            surveyId={survey._id}
            habit={currentHabit}
            onLog={handleResponse}
          />
        )}

        <Group justify="space-between" mt="xl">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          {currentQuestionIndex > 0 && (
            <Button
              variant="subtle"
              onClick={() => {
                setCurrentQuestionIndex(currentQuestionIndex - 1)
                setResponses(responses.slice(0, -1))
              }}
            >
              Previous
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  )
}

export default SurveyFlow
