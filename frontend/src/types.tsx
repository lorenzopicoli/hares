export type QuestionType =
  | 'number'
  | 'scale'
  | 'boolean'
  | 'text'
  | 'mood'
  | 'food'
  | 'text_list'
export type TimeOfDay = 'morning' | 'afternoon' | 'night' | 'anytime'
export type TimeTrackingType = 'general' | 'exact'
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type LogValue =
  | number // for 'number' and 'scale' types
  | boolean // for 'boolean' type
  | string[] // for 'mood', 'food', and 'text_list' types
  | string // for 'text' type

export interface Habit {
  id: string
  question: string
  type: QuestionType
  timeTracking: {
    type: TimeTrackingType
    defaultTime?: TimeOfDay
  }
  options?: string[] // Used for storing previously used options for mood/food
}

export interface HabitLog {
  habitId: string
  timestamp: number
  value: LogValue
  valueType: QuestionType
  generalTime?: TimeOfDay
  isExactTime: boolean
  date: Date
  surveyId?: string
  mealType?: MealType // Only used for food habits
}

export interface Survey {
  id: string
  name: string
  habits: string[]
}
