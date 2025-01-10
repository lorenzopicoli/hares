import {
  Button,
  TextInput,
  Text,
  Select,
  Group,
  Paper,
  Stack,
  ActionIcon,
} from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { IconClock } from '@tabler/icons-react'
import React, { useState } from 'react'
import type { Habit, HabitLog } from './types'

function HabitCard({
  habit,
  surveyId,
  onLog,
}: {
  habit: Habit
  surveyId?: string
  onLog: (log: HabitLog) => void
}) {
  const [value, setValue] = useState<any>(null)
  const [recordedTime, setRecordedTime] = useState<string>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleSubmit = () => {
    if (value !== null) {
      if (habit.timeTracking.type === 'exact') {
        // Create a base date - either the selected date or today
        const baseDate = selectedDate || new Date()

        // If we have a selected time, parse and set it
        if (selectedTime) {
          const [hours, minutes] = selectedTime.split(':').map(Number)
          baseDate.setHours(hours || 0)
          baseDate.setMinutes(minutes || 0)
        }

        const log: HabitLog = {
          habitId: habit.id,
          timestamp: new Date().valueOf(),
          value,
          exactTime: baseDate,
          surveyId,
        }

        onLog(log)
      } else {
        const log: HabitLog = {
          habitId: habit.id,
          timestamp: new Date().valueOf(),
          value,
          recordedTime: recordedTime || habit.timeTracking.defaultTime,
          surveyId,
        }
        onLog(log)
      }

      // Reset form
      setValue(null)
      setRecordedTime(undefined)
      setSelectedTime('')
      setSelectedDate(null)
      setShowDatePicker(false)
    }
  }

  const renderInput = () => {
    switch (habit.type) {
      case 'number':
        return (
          <TextInput
            type="number"
            value={value || ''}
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="Enter a number"
          />
        )
      case 'scale':
        return (
          <Select
            value={value?.toString()}
            onChange={(val) => setValue(Number(val))}
            data={[
              { value: '1', label: '1 - Poor' },
              { value: '2', label: '2' },
              { value: '3', label: '3 - Average' },
              { value: '4', label: '4' },
              { value: '5', label: '5 - Excellent' },
            ]}
          />
        )
      case 'boolean':
        return (
          <Group>
            <Button
              variant={value === true ? 'filled' : 'outline'}
              onClick={() => setValue(true)}
            >
              Yes
            </Button>
            <Button
              variant={value === false ? 'filled' : 'outline'}
              onClick={() => setValue(false)}
            >
              No
            </Button>
          </Group>
        )
      default:
        return null
    }
  }

  const renderTimeInput = () => {
    if (habit.timeTracking.type === 'exact') {
      return (
        <Stack gap="xs">
          <Group align="flex-end">
            <TimeInput
              label="Time"
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => setShowDatePicker(!showDatePicker)}
              mb={8}
            >
              <IconClock size={16} />
            </ActionIcon>
          </Group>

          {showDatePicker && (
            <DatePickerInput
              label="Date"
              placeholder="Pick a date"
              value={selectedDate}
              onChange={setSelectedDate}
              clearable
              maxDate={new Date()}
            />
          )}
        </Stack>
      )
    }

    return (
      <Select
        label="Time of day"
        value={recordedTime || habit.timeTracking.defaultTime}
        onChange={(v) => setRecordedTime(v ?? '')}
        data={[
          { value: 'morning', label: 'Morning' },
          { value: 'afternoon', label: 'Afternoon' },
          { value: 'night', label: 'Night' },
        ]}
      />
    )
  }

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Text>{habit.question}</Text>
        {renderInput()}
        {renderTimeInput()}
        <Button onClick={handleSubmit} disabled={value === null}>
          Log
        </Button>
      </Stack>
    </Paper>
  )
}

export default HabitCard
