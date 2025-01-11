import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const habits = sqliteTable('habits', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  question: text('question').notNull(),
  type: text('type').notNull(),
  defaultTime: text('default_time'),
  options: text('options'), // Stored as JSON string
  isPinned: integer('is_pinned', { mode: 'boolean' }),
  order: integer('order'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('created_at', { mode: 'timestamp' }),
})

export const surveys = sqliteTable('surveys', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  name: text('name').notNull(),
  habits: text('habits').notNull(), // Stored as JSON string of habit IDs
  isPinned: integer('is_pinned', { mode: 'boolean' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('created_at', { mode: 'timestamp' }),
})

export const logs = sqliteTable('logs', {
  id: text('id').primaryKey(),
  deviceId: text('device_id').notNull(),
  habitId: text('habit_id')
    .references(() => habits.id)
    .notNull(),
  timestamp: integer('timestamp').notNull(),
  value: text('value').notNull(), // Stored as JSON string
  valueType: text('value_type').notNull(),
  timeType: text('time_type').notNull(),
  generalTime: text('general_time'),
  exactTime: text('exact_time'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  surveyId: text('survey_id').references(() => surveys.id),
  mealType: text('meal_type'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('created_at', { mode: 'timestamp' }),
})
