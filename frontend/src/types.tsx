export type QuestionType = 'number' | 'scale' | 'boolean' | 'text'
export type TimeOfDay = 'morning' | 'afternoon' | 'night' | 'anytime'
export type TimeTrackingType = 'general' | 'exact'

export interface Habit {
  id: string
  question: string
  type: QuestionType
  timeTracking: {
    type: TimeTrackingType
    defaultTime?: TimeOfDay // Only used when type is 'general'
  }
  options?: string[]
}

export interface HabitLog {
  habitId: string
  timestamp: number // When the log was created
  value: any
  recordedTime?: string // General time of day
  exactTime?: Date // Exact time when the habit occurred
  surveyId?: string
}

export interface Survey {
  id: string
  name: string
  habits: string[] // Array of habit IDs
}
