import { Stack, TextInput, MultiSelect, Button } from '@mantine/core'
import React, { useState } from 'react'
import type { Habit, Survey } from './types'

function AddSurveyForm({
  habits,
  onSubmit,
}: {
  habits: Habit[]
  onSubmit: (survey: Survey) => void
}) {
  const [name, setName] = useState('')
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && selectedHabits.length > 0) {
      const newSurvey: Survey = {
        id: Date.now().toString(),
        name,
        habits: selectedHabits,
        isPinned: false, // Add isPinned property
      }

      onSubmit(newSurvey)
      setName('')
      setSelectedHabits([])
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Survey Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Daily Health Check"
        />
        <MultiSelect
          label="Select Habits"
          required
          data={habits.map((habit) => ({
            value: habit.id,
            label: habit.question,
          }))}
          value={selectedHabits}
          onChange={setSelectedHabits}
          placeholder="Choose habits to include"
          searchable
          clearable
        />
        <Button
          type="submit"
          disabled={!name || selectedHabits.length === 0}
          variant="filled"
        >
          Create Survey
        </Button>
      </Stack>
    </form>
  )
}

export default AddSurveyForm
