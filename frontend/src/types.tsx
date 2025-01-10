export type QuestionType =
  | 'number'
  | 'scale'
  | 'boolean'
  | 'text'
  | 'mood'
  | 'food'
  | 'text_list'
export type TimeOfDay = 'morning' | 'afternoon' | 'night' | 'anytime'
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
  defaultTime?: TimeOfDay
  options?: string[] // Used for storing previously used options for mood/food
  isPinned?: boolean // Whether this habit is pinned to quick access
  order?: number // For controlling the order in the quick access grid
}

export interface HabitLog {
  habitId: string
  timestamp: number
  value: LogValue
  valueType: QuestionType
  timeType: 'general' | 'exact'
  generalTime?: TimeOfDay
  exactTime?: string
  date: Date
  surveyId?: string
  mealType?: MealType // Only used for food habits
}

export interface Survey {
  id: string
  name: string
  habits: string[]
  isPinned?: boolean // Added isPinned property
}
