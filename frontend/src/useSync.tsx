import { useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from '@mantine/hooks'
import { trpc } from './api/trpc'
import type {
  Habit,
  Survey,
  HabitLog,
  QuestionType,
  TimeOfDay,
  MealType,
} from './types'
import { useConnection } from './useConnection'

export interface PendingSync {
  habits: Habit[]
  surveys: Survey[]
  logs: HabitLog[]
  habitPins: Record<string, boolean>
  surveyPins: Record<string, boolean>
}

export function useSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncFailed, setLastSyncFailed] = useState(false)
  const { isConnected, deviceId } = useConnection()

  // Local cache of data
  const [habitsCache, setHabitsCache] = useLocalStorage<Habit[]>({
    key: 'habits',
    defaultValue: [],
  })
  const [surveysCache, setSurveysCache] = useLocalStorage<Survey[]>({
    key: 'surveys',
    defaultValue: [],
  })
  const [logsCache, setLogsCache] = useLocalStorage<HabitLog[]>({
    key: 'logs',
    defaultValue: [],
  })

  // Track items created while offline that need to be synced
  const [pendingSync, setPendingSync] = useLocalStorage<PendingSync>({
    key: 'pendingSync',
    defaultValue: {
      habits: [],
      surveys: [],
      logs: [],
      habitPins: {},
      surveyPins: {},
    },
  })

  // TRPC mutations
  const createHabitMutation = trpc.createHabit.useMutation()
  const createSurveyMutation = trpc.createSurvey.useMutation()
  const logHabitsMutation = trpc.logHabits.useMutation()
  const deleteHabitMutation = trpc.deleteHabit.useMutation()
  const deleteHabitLogMutation = trpc.deleteHabitLog.useMutation()
  const deleteSurveyMutation = trpc.deleteSurvey.useMutation()
  const toggleHabitPinMutation = trpc.toggleHabitPin.useMutation()
  const toggleSurveyPinMutation = trpc.toggleSurveyPin.useMutation()

  // TRPC queries
  const habitsQuery = trpc.getAllHabits.useQuery(
    { deviceId },
    { enabled: isConnected }
  )
  const surveysQuery = trpc.getAllSurveys.useQuery(
    { deviceId },
    { enabled: isConnected }
  )
  const logsQuery = trpc.getHabitLogs.useQuery(
    {
      deviceId,
    },
    { enabled: isConnected }
  )

  useEffect(() => {
    if (habitsQuery.data) {
      setHabitsCache(
        habitsQuery.data.map((h) => ({
          ...h,
          type: h.type as QuestionType,
          defaultTime: (h.defaultTime as TimeOfDay) ?? undefined,
          isPinned: h.isPinned ?? false,
          order: h.order ?? undefined,
        }))
      )
    }
  }, [habitsQuery.data])

  useEffect(() => {
    if (surveysQuery.data) {
      setSurveysCache(
        surveysQuery.data.map((s) => ({
          ...s,
          isPinned: s.isPinned ?? false,
        }))
      )
    }
  }, [surveysQuery.data])

  useEffect(() => {
    if (logsQuery.data) {
      setLogsCache(
        logsQuery.data.map((l) => ({
          ...l,
          value: l.value ?? 'Unknown value',
          valueType: l.value,
          timeType: l.timeType as 'exact' | 'general',
          generalTime: l.generalTime as TimeOfDay,
          exactTime: l.exactTime ?? undefined,
          surveyId: l.surveyId ?? undefined,
          mealType: (l.mealType as MealType) ?? undefined,
        }))
      )
    }
  }, [logsQuery.data])

  // Sync functions
  const syncPendingItems = async () => {
    if (!isConnected) return

    setIsSyncing(true)
    try {
      // Sync pending habits
      for (const habit of pendingSync.habits) {
        await createHabitMutation.mutateAsync({
          deviceId,
          habit: {
            id: habit.id,
            question: habit.question,
            type: habit.type,
            defaultTime: habit.defaultTime,
            options: habit.options,
            isPinned: habit.isPinned,
            order: habit.order,
          },
        })
      }

      // Sync pending surveys
      for (const survey of pendingSync.surveys) {
        await createSurveyMutation.mutateAsync({
          deviceId,
          survey: {
            id: survey.id,
            name: survey.name,
            habits: survey.habits,
            isPinned: survey.isPinned,
          },
        })
      }

      // Sync pending logs in batches
      const pendingLogs = pendingSync.logs
      const BATCH_SIZE = 50
      for (let i = 0; i < pendingLogs.length; i += BATCH_SIZE) {
        const batch = pendingLogs.slice(i, i + BATCH_SIZE)
        await logHabitsMutation.mutateAsync({
          deviceId,
          logs: batch,
        })
      }

      for (const surveyId of Object.keys(pendingSync.surveyPins)) {
        await toggleSurveyPinMutation.mutateAsync({
          deviceId,
          surveyId,
          isPinned: pendingSync.surveyPins[surveyId],
        })
      }

      for (const habitId of Object.keys(pendingSync.habitPins)) {
        await toggleHabitPinMutation.mutateAsync({
          deviceId,
          habitId,
          isPinned: pendingSync.habitPins[habitId],
        })
      }

      // Clear pending items
      setPendingSync({
        habits: [],
        surveys: [],
        logs: [],
        habitPins: {},
        surveyPins: {},
      })
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const addHabit = async (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
    }

    if (isConnected) {
      try {
        await createHabitMutation.mutateAsync({
          deviceId,
          habit: newHabit,
        })
        habitsQuery.refetch()
      } catch (error) {
        setPendingSync((prev) => ({
          ...prev,
          habits: [...prev.habits, newHabit],
        }))
      }
    } else {
      // Store for later sync if offline
      setPendingSync((prev) => ({
        ...prev,
        habits: [...prev.habits, newHabit],
      }))
    }
  }

  const addSurvey = async (survey: Omit<Survey, 'id'>) => {
    const newSurvey: Survey = {
      ...survey,
      id: crypto.randomUUID(),
    }

    if (isConnected) {
      try {
        await createSurveyMutation.mutateAsync({
          deviceId,
          survey: newSurvey,
        })
        surveysQuery.refetch()
      } catch (error) {
        setPendingSync((prev) => ({
          ...prev,
          surveys: [...prev.surveys, newSurvey],
        }))
      }
    } else {
      setPendingSync((prev) => ({
        ...prev,
        surveys: [...prev.surveys, newSurvey],
      }))
    }
  }

  const addLog = async (log: Omit<HabitLog, 'id'>) => {
    const newLog: HabitLog = {
      ...log,
      id: crypto.randomUUID(),
    }

    if (isConnected) {
      try {
        await logHabitsMutation.mutateAsync({
          deviceId,
          logs: [newLog],
        })
        logsQuery.refetch()
      } catch (error) {
        setPendingSync((prev) => ({
          ...prev,
          logs: [...prev.logs, newLog],
        }))
      }
    } else {
      setPendingSync((prev) => ({
        ...prev,
        logs: [...prev.logs, newLog],
      }))
    }
  }

  const toggleSurveyPin = async (surveyId: string, isPinned: boolean) => {
    if (isConnected) {
      try {
        await toggleSurveyPinMutation.mutateAsync({
          deviceId,
          surveyId,
          isPinned,
        })
        // Good enough for now
        surveysQuery.refetch()
      } catch (error) {
        setPendingSync((prev) => ({
          ...prev,
          surveyPins: { ...prev.surveyPins, [surveyId]: isPinned },
        }))
      }
    } else {
      setPendingSync((prev) => ({
        ...prev,
        surveyPins: { ...prev.surveyPins, [surveyId]: isPinned },
      }))
    }
  }

  const toggleHabitPin = async (habitId: string, isPinned: boolean) => {
    if (isConnected) {
      try {
        await toggleHabitPinMutation.mutateAsync({
          deviceId,
          habitId,
          isPinned,
        })
        habitsQuery.refetch()
      } catch (error) {
        setPendingSync((prev) => ({
          ...prev,
          habitPins: { ...prev.habitPins, [habitId]: isPinned },
        }))
      }
    } else {
      setPendingSync((prev) => ({
        ...prev,
        habitPins: { ...prev.habitPins, [habitId]: isPinned },
      }))
    }
  }

  // Delete operations - only allowed when online
  const deleteHabit = async (habitId: string) => {
    if (!isConnected) {
      throw new Error('Cannot delete habits while offline')
    }

    await deleteHabitMutation.mutateAsync({ deviceId, habitId })
    habitsQuery.refetch()
  }

  const deleteLog = async (logId: string) => {
    if (!isConnected) {
      throw new Error('Cannot delete habits while offline')
    }

    await deleteHabitLogMutation.mutateAsync({ deviceId, logId })
    logsQuery.refetch()
  }

  const deleteSurvey = async (surveyId: string) => {
    if (!isConnected) {
      throw new Error('Cannot delete surveys while offline')
    }

    await deleteSurveyMutation.mutateAsync({ deviceId, surveyId })
    surveysQuery.refetch()
  }

  useEffect(() => {
    if (isConnected) {
      syncPendingItems()
    }
  }, [isConnected])

  const habits = useMemo(() => {
    const data: Habit[] = habitsCache.map((habit) => ({
      ...habit,
      isPinned: pendingSync.habitPins[habit.id] ?? habit.isPinned,
    }))

    if (pendingSync.habits && pendingSync.habits.length > 0) {
      data.push(
        ...pendingSync.habits.map((h) => ({
          ...h,
          isPendingSync: true,
          isPinned: pendingSync.habitPins[h.id] ?? h.isPinned,
        }))
      )
    }

    return data
  }, [habitsCache, pendingSync.habits, pendingSync.habitPins])

  const surveys = useMemo(() => {
    const data: Survey[] = surveysCache.map((survey) => ({
      ...survey,
      isPinned: pendingSync.surveyPins[survey.id] ?? survey.isPinned,
    }))

    if (pendingSync.surveys && pendingSync.surveys.length > 0) {
      data.push(
        ...pendingSync.surveys.map((h) => ({
          ...h,
          isPendingSync: true,
          isPinned: pendingSync.surveyPins[h.id] ?? h.isPinned,
        }))
      )
    }

    return data
  }, [surveysCache, pendingSync.surveys, pendingSync.surveyPins])

  const logs = useMemo(() => {
    const data: HabitLog[] = []
    data.push(...logsCache)

    if (pendingSync.logs && pendingSync.logs.length > 0) {
      data.push(...pendingSync.logs.map((h) => ({ ...h, isPendingSync: true })))
    }

    return data
  }, [logsCache, pendingSync.logs])

  return {
    habits,
    surveys,
    logs,
    addHabit,
    addSurvey,
    addLog,
    deleteLog,
    deleteHabit,
    deleteSurvey,
    toggleHabitPin,
    toggleSurveyPin,
    isSyncing,
    lastSyncFailed,
    pendingChanges:
      Object.keys(pendingSync.habits).length +
      Object.keys(pendingSync.surveys).length +
      Object.keys(pendingSync.logs).length,
    syncPendingItems,
    pendingSync,
  }
}
