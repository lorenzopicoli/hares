import React from 'react'
import { Paper, Text, Group, Button, Stack } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import type { Survey } from './types'

interface SurveyListProps {
  surveys: Survey[]
  onStartSurvey: (surveyId: string) => void
}

function SurveyList({ surveys, onStartSurvey }: SurveyListProps) {
  return (
    <Stack>
      {surveys.map((survey) => (
        <Paper
          key={survey.id}
          p="md"
          withBorder
          className="hover:bg-gray-800 transition-colors cursor-pointer"
          onClick={() => onStartSurvey(survey.id)}
        >
          <Group justify="space-between" align="center">
            <div>
              <Text size="lg" fw={500}>
                {survey.name}
              </Text>
              <Text size="sm" c="dimmed">
                {survey.habits.length} questions
              </Text>
            </div>
            <Button
              variant="subtle"
              rightSection={<IconChevronRight size={16} />}
            >
              Start Survey
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  )
}

export default SurveyList
