import {
  Button,
  TextInput,
  Text,
  Select,
  Group,
  Paper,
  Stack,
  ActionIcon,
  Combobox,
  Pill,
  PillsInput,
  useCombobox,
  CheckIcon,
} from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { IconClock } from '@tabler/icons-react'
import React, { useState, useEffect } from 'react'
import type { Habit, HabitLog, MealType, LogValue, TimeOfDay } from './types'

function HabitCard({
  habit,
  surveyId,
  onLog,
}: {
  habit: Habit
  surveyId?: string
  onLog: (log: HabitLog) => void
}) {
  const [value, setValue] = useState<LogValue | null>(null)
  const [timeType, setTimeType] = useState<'general' | 'exact'>('general')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [generalTime, setGeneralTime] = useState<TimeOfDay>(
    habit.defaultTime || 'anytime'
  )
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [mealType, setMealType] = useState<MealType | ''>('')

  // For creatable multi-select
  const [search, setSearch] = useState('')
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  })

  // Load previously used options from localStorage
  const storageKey = `habit-${habit.id}-options`
  const [options, setOptions] = useState<string[]>(() => {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : habit.options || []
  })

  // For multi-select values
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  // Save options to localStorage when they change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(options))
  }, [options, storageKey])

  const handleValueSelect = (val: string) => {
    setSearch('')

    if (val === '$create') {
      const newValue = search.trim()
      if (!options.includes(newValue)) {
        setOptions((current) => [...current, newValue])
      }
      setSelectedValues((current) => [...current, newValue])
      setValue([...selectedValues, newValue])
    } else {
      const newValues = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val]
      setSelectedValues(newValues)
      setValue(newValues)
    }
  }

  const handleValueRemove = (val: string) => {
    const newValues = selectedValues.filter((v) => v !== val)
    setSelectedValues(newValues)
    setValue(newValues)
  }

  const handleSubmit = () => {
    if (value !== null) {
      const now = new Date()
      const baseDate = selectedDate || now

      // Set time if exact time tracking is selected
      if (timeType === 'exact' && selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number)
        baseDate.setHours(hours || 0)
        baseDate.setMinutes(minutes || 0)
      }

      const log: HabitLog = {
        habitId: habit.id,
        timestamp: now.valueOf(),
        value,
        valueType: habit.type,
        timeType,
        date: baseDate,
        surveyId,
        ...(timeType === 'general' && { generalTime }),
        ...(timeType === 'exact' && { exactTime: selectedTime }),
        ...(habit.type === 'food' &&
          mealType && { mealType: mealType as MealType }),
      }

      onLog(log)

      // Reset form
      setValue(null)
      setSelectedValues([])
      setGeneralTime(habit.defaultTime || 'anytime')
      setSelectedTime('')
      setSelectedDate(null)
      setShowDatePicker(false)
      setMealType('')
    }
  }

  const renderMultiSelect = () => {
    const values = selectedValues.map((item) => (
      <Pill
        key={item}
        withRemoveButton
        onRemove={() => handleValueRemove(item)}
      >
        {item}
      </Pill>
    ))

    const comboboxOptions = options
      .filter((item) =>
        item.toLowerCase().includes(search.trim().toLowerCase())
      )
      .map((item) => (
        <Combobox.Option
          value={item}
          key={item}
          active={selectedValues.includes(item)}
        >
          <Group gap="sm">
            {selectedValues.includes(item) ? <CheckIcon size={12} /> : null}
            <span>{item}</span>
          </Group>
        </Combobox.Option>
      ))

    const exactOptionMatch = options.some(
      (item) => item.toLowerCase() === search.trim().toLowerCase()
    )

    return (
      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
      >
        <Combobox.DropdownTarget>
          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group>
              {values}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder={`Search ${
                    habit.type === 'mood'
                      ? 'moods'
                      : habit.type === 'food'
                      ? 'food items'
                      : 'options'
                  }`}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex()
                    setSearch(event.currentTarget.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault()
                      handleValueRemove(
                        selectedValues[selectedValues.length - 1]
                      )
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {comboboxOptions}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search.trim()}
              </Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    )
  }

  const renderMealTypeInput = () => {
    if (habit.type === 'food') {
      return (
        <Select
          label="Meal Type"
          required
          value={mealType}
          onChange={(val) => setMealType((val || '') as MealType)}
          data={[
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'lunch', label: 'Lunch' },
            { value: 'dinner', label: 'Dinner' },
            { value: 'snack', label: 'Snack' },
          ]}
        />
      )
    }
    return null
  }

  const renderInput = () => {
    switch (habit.type) {
      case 'number':
        return (
          <TextInput
            type="number"
            value={value?.toString() || ''}
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
      case 'mood':
      case 'food':
      case 'text_list':
        return renderMultiSelect()
      default:
        return null
    }
  }

  const renderTimeInput = () => {
    return (
      <Stack gap="xs">
        <Group align="flex-end">
          <Select
            style={{ flex: 1 }}
            label="Time tracking type"
            value={timeType}
            onChange={(value) => setTimeType(value as 'general' | 'exact')}
            data={[
              { value: 'general', label: 'General time' },
              { value: 'exact', label: 'Exact time' },
            ]}
          />

          {timeType === 'exact' ? (
            <TimeInput
              label="Time"
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
          ) : (
            <Select
              label="Time of day"
              value={generalTime}
              onChange={(v) => setGeneralTime((v ?? 'anytime') as TimeOfDay)}
              data={[
                { value: 'anytime', label: 'Anytime' },
                { value: 'morning', label: 'Morning' },
                { value: 'afternoon', label: 'Afternoon' },
                { value: 'night', label: 'Night' },
              ]}
              style={{ flex: 1 }}
            />
          )}

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

  const isSubmitDisabled = () => {
    if (!value) return true
    if (habit.type === 'food' && !mealType) return true
    return false
  }

  return (
    <Paper p="md" withBorder>
      <Stack>
        <Text>{habit.question}</Text>
        {renderInput()}
        {renderMealTypeInput()}
        {renderTimeInput()}
        <Button onClick={handleSubmit} disabled={isSubmitDisabled()}>
          Log
        </Button>
      </Stack>
    </Paper>
  )
}

export default HabitCard
