import { Stack, TextInput, Select, Button } from '@mantine/core'
import React, { useState } from 'react'
import type { Habit, QuestionType, TimeOfDay } from './types'

function AddHabitForm({
  onSubmit,
}: {
  onSubmit: (habit: Omit<Habit, 'id'>) => void
}) {
  const [question, setQuestion] = useState('')
  const [type, setType] = useState<QuestionType>('number')
  const [defaultTime, setDefaultTime] = useState<TimeOfDay>('anytime')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      question,
      type,
      defaultTime,
      options: [],
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
          placeholder="e.g., How many glasses of water did you drink?"
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
            { value: 'mood', label: 'Mood Tracking' },
            { value: 'food', label: 'Food Tracking' },
            { value: 'text_list', label: 'Multiple Text Selection' },
          ]}
        />

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

        <Button type="submit">Add Habit</Button>
      </Stack>
    </form>
  )
}

export default AddHabitForm
