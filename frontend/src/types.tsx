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
  generalTime?: string // General time of day
  isExactTime: boolean // if true, the date parameter is the exact time it happened
  date: Date // This is either the exact time the habit occurred or the date for which the generalTime is referring to
  surveyId?: string
}

export interface Survey {
  id: string
  name: string
  habits: string[] // Array of habit IDs
}
