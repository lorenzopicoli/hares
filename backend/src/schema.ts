import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
})

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').references(() => devices.id),
  question: text('question').notNull(),
  type: text('type').notNull(),
  defaultTime: text('default_time'),
  options: text('options'), // Stored as JSON string
  isPinned: integer('is_pinned', { mode: 'boolean' }),
  order: integer('order'),
})

export const surveys = sqliteTable('surveys', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').references(() => devices.id),
  name: text('name').notNull(),
  habits: text('habits').notNull(), // Stored as JSON string of habit IDs
  isPinned: integer('is_pinned', { mode: 'boolean' }),
})

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').references(() => devices.id),
  habitId: text('habit_id').references(() => habits.id),
  timestamp: integer('timestamp').notNull(),
  value: text('value').notNull(), // Stored as JSON string
  valueType: text('value_type').notNull(),
  timeType: text('time_type').notNull(),
  generalTime: text('general_time'),
  exactTime: text('exact_time'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  surveyId: text('survey_id').references(() => surveys.id),
  mealType: text('meal_type'),
})
