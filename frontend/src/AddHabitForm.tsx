import { Stack, TextInput, Select, Button, Group, Text } from '@mantine/core'
import React, { useState } from 'react'
import type { Habit, QuestionType, TimeTrackingType, TimeOfDay } from './types'

function AddHabitForm({
  onSubmit,
}: {
  onSubmit: (habit: Omit<Habit, 'id'>) => void
}) {
  const [question, setQuestion] = useState('')
  const [type, setType] = useState<QuestionType>('number')
  const [timeTrackingType, setTimeTrackingType] =
    useState<TimeTrackingType>('general')
  const [defaultTime, setDefaultTime] = useState<TimeOfDay>('anytime')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      question,
      type,
      timeTracking: {
        type: timeTrackingType,
        defaultTime: timeTrackingType === 'general' ? defaultTime : undefined,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Question"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Select
          label="Type"
          required
          value={type}
          onChange={(value) => setType(value as QuestionType)}
          data={[
            { value: 'number', label: 'Number' },
            { value: 'scale', label: 'Scale (1-5)' },
            { value: 'boolean', label: 'Yes/No' },
          ]}
        />

        <Select
          label="Time Tracking"
          required
          value={timeTrackingType}
          onChange={(value) => setTimeTrackingType(value as TimeTrackingType)}
          data={[
            {
              value: 'general',
              label: 'General time of day (Morning, Afternoon, etc.)',
            },
            { value: 'exact', label: 'Exact time' },
          ]}
        />

        {timeTrackingType === 'general' && (
          <Select
            label="Default Time"
            required
            value={defaultTime}
            onChange={(value) => setDefaultTime(value as TimeOfDay)}
            data={[
              { value: 'anytime', label: 'Anytime' },
              { value: 'morning', label: 'Morning' },
              { value: 'afternoon', label: 'Afternoon' },
              { value: 'night', label: 'Night' },
            ]}
          />
        )}

        <Button type="submit">Add Habit</Button>
      </Stack>
    </form>
  )
}

export default AddHabitForm
