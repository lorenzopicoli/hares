import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { db } from '../db/connection'
import { habits, logs, surveys } from '../schema'
import { randomUUID } from 'crypto'

// Define validation schemas based on frontend types
const timeOfDaySchema = z.enum(['morning', 'afternoon', 'night', 'anytime'])
const questionTypeSchema = z.enum([
  'number',
  'scale',
  'boolean',
  'text',
  'mood',
  'food',
  'text_list',
])
const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack'])

const logValueSchema = z.union([
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.string(),
])

export const t = initTRPC.create()

export const loggedProcedure = t.procedure.use(async (opts) => {
  const start = Date.now()
  const result = await opts.next()
  const durationMs = Date.now() - start
  const meta = { path: opts.path, type: opts.type, durationMs }

  result.ok
    ? console.log('OK request timing:', meta)
    : console.error('Non-OK request timing', meta)

  return result
})

export const appRouter = t.router({
  health: loggedProcedure
    .input(z.object({ deviceId: z.string().uuid() }))
    .query(async ({ input }) => {
      return { status: 'ok' }
    }),

  getHabitLogs: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(logs.deviceId, input.deviceId)]

      const results = await db
        .select()
        .from(logs)
        .where(and(...conditions))
        .orderBy(logs.date)

      return results.map((log) => ({
        ...log,
        value: JSON.parse(log.value),
        date: new Date(log.date),
      }))
    }),

  logHabits: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        logs: z.array(
          z.object({
            id: z.string().uuid().optional(),
            habitId: z.string(),
            timestamp: z.number(),
            value: logValueSchema,
            valueType: questionTypeSchema,
            timeType: z.enum(['general', 'exact']),
            generalTime: timeOfDaySchema.optional(),
            exactTime: z.string().optional(),
            date: z.string().datetime(),
            surveyId: z.string().optional(),
            mealType: mealTypeSchema.optional(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const logsToInsert = input.logs.map((log) => ({
        id: log.id ?? randomUUID(),
        deviceId: input.deviceId,
        habitId: log.habitId,
        timestamp: log.timestamp,
        value: JSON.stringify(log.value),
        valueType: log.valueType,
        timeType: log.timeType,
        generalTime: log.generalTime,
        exactTime: log.exactTime,
        date: new Date(log.date),
        surveyId: log.surveyId,
        mealType: log.mealType,
        createdAt: new Date(),
      }))

      await db.insert(logs).values(logsToInsert)
      return { success: true, count: logsToInsert.length }
    }),

  createHabit: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        habit: z.object({
          id: z.string().uuid().optional(),
          question: z.string(),
          type: questionTypeSchema,
          defaultTime: timeOfDaySchema.optional(),
          options: z.array(z.string()).optional(),
          isPinned: z.boolean().optional(),
          order: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const habitToInsert = {
        id: input.habit.id ?? randomUUID(),
        deviceId: input.deviceId,
        ...input.habit,
        options: input.habit.options
          ? JSON.stringify(input.habit.options)
          : null,
        createdAt: new Date(),
      }

      await db.insert(habits).values(habitToInsert)
      return habitToInsert
    }),

  deleteHabit: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        habitId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Delete all logs for this habit
      await db
        .delete(logs)
        .where(
          and(
            eq(logs.habitId, input.habitId),
            eq(logs.deviceId, input.deviceId)
          )
        )

      // Delete the habit
      await db
        .delete(habits)
        .where(
          and(eq(habits.id, input.habitId), eq(habits.deviceId, input.deviceId))
        )

      return { success: true }
    }),

  deleteHabitLog: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        logId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(logs)
        .where(and(eq(logs.id, input.logId), eq(logs.deviceId, input.deviceId)))

      return { success: true }
    }),

  createSurvey: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        survey: z.object({
          id: z.string().uuid().optional(),
          name: z.string(),
          habits: z.array(z.string()),
          isPinned: z.boolean().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const surveyToInsert = {
        id: input.survey.id ?? randomUUID(),
        deviceId: input.deviceId,
        name: input.survey.name,
        habits: JSON.stringify(input.survey.habits),
        isPinned: input.survey.isPinned,
        createdAt: new Date(),
      }

      await db.insert(surveys).values(surveyToInsert)
      return surveyToInsert
    }),

  deleteSurvey: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        surveyId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Update logs to remove survey reference
      await db
        .update(logs)
        .set({ surveyId: null })
        .where(
          and(
            eq(logs.surveyId, input.surveyId),
            eq(logs.deviceId, input.deviceId)
          )
        )

      // Delete the survey
      await db
        .delete(surveys)
        .where(
          and(
            eq(surveys.id, input.surveyId),
            eq(surveys.deviceId, input.deviceId)
          )
        )

      return { success: true }
    }),

  getAllHabits: loggedProcedure
    .input(z.object({ deviceId: z.string().uuid() }))
    .query(async ({ input }) => {
      const results = await db
        .select()
        .from(habits)
        .where(eq(habits.deviceId, input.deviceId))
        .orderBy(habits.order)

      return results.map((habit) => ({
        ...habit,
        options: habit.options ? JSON.parse(habit.options) : [],
      }))
    }),

  getAllSurveys: loggedProcedure
    .input(z.object({ deviceId: z.string().uuid() }))
    .query(async ({ input }) => {
      const results = await db
        .select()
        .from(surveys)
        .where(eq(surveys.deviceId, input.deviceId))

      return results.map((survey) => ({
        ...survey,
        habits: JSON.parse(survey.habits) as string[],
      }))
    }),

  updateHabit: loggedProcedure
    .input(
      z.object({
        deviceId: z.string().uuid(),
        habitId: z.string(),
        updates: z.object({
          question: z.string().optional(),
          type: questionTypeSchema.optional(),
          defaultTime: timeOfDaySchema.optional(),
          options: z.array(z.string()).optional(),
          isPinned: z.boolean().optional(),
          order: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const updates = {
        ...input.updates,
        options: input.updates.options
          ? JSON.stringify(input.updates.options)
          : undefined,
      }

      await db
        .update(habits)
        .set(updates)
        .where(
          and(eq(habits.id, input.habitId), eq(habits.deviceId, input.deviceId))
        )

      return { success: true }
    }),
})

export type AppRouter = typeof appRouter
