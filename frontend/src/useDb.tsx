import { useState, useEffect } from 'react'
import PouchDB from 'pouchdb-browser'
import { useLocalStorage } from '@mantine/hooks'
import { v4 as uuidv4 } from 'uuid'
import PouchdbFind from 'pouchdb-find'
import type { QuestionType } from './types'

// Add find plugin for querying
PouchDB.plugin(PouchdbFind)

export function useDB() {
  const [db] = useState(() => new PouchDB('hares_db'))

  const [deviceId] = useLocalStorage({
    key: 'deviceId',
    defaultValue: uuidv4(),
  })

  useEffect(() => {
    db.createIndex({
      index: { fields: ['type', 'createdAt'] },
    })
  }, [])

  return {
    db,
    deviceId,
  }
}

// These type definitions will help us maintain consistent document structure
export interface DocBase {
  _id: string
  _rev?: string
  type: 'habit' | 'survey' | 'log'
  deviceId: string
  createdAt: number
  updatedAt: number
}
export interface HabitDoc extends DocBase {
  type: 'habit'
  question: string
  habitType: QuestionType
  defaultTime?: 'morning' | 'afternoon' | 'night' | 'anytime'
  options?: string[]
  isPinned?: boolean
  order?: number
}

export interface SurveyDoc extends DocBase {
  type: 'survey'
  name: string
  habits: string[]
  isPinned?: boolean
}

export interface LogDoc extends DocBase {
  type: 'log'
  habitId: string
  value: any
  valueType: QuestionType
  timeType: 'general' | 'exact'
  generalTime?: 'morning' | 'afternoon' | 'night' | 'anytime'
  exactTime?: string
  date: string
  surveyId?: string
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}
