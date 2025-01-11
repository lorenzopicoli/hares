import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  //   await knex.schema.createTable('devices', (table) => {
  //     table.text('id').primary()
  //     table.timestamp('created_at').notNullable()
  //   })

  await knex.schema.createTable('habits', (table) => {
    table.text('id').primary()
    table.text('device_id').notNullable()
    table.text('question').notNullable()
    table.text('type').notNullable()
    table.text('default_time')
    table.text('options')
    table.boolean('is_pinned')
    table.integer('order')
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')

    table.index('device_id')
  })

  await knex.schema.createTable('surveys', (table) => {
    table.text('id').primary()
    table.text('device_id').notNullable()
    table.text('name').notNullable()
    table.text('habits').notNullable()
    table.boolean('is_pinned')
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')

    table.index('device_id')
  })

  await knex.schema.createTable('logs', (table) => {
    table.text('id').primary()
    table.text('device_id').notNullable()
    table.text('habit_id').notNullable().references('id').inTable('habits')
    table.bigInteger('timestamp').notNullable()
    table.text('value').notNullable()
    table.text('value_type').notNullable()
    table.text('time_type').notNullable()
    table.text('general_time')
    table.text('exact_time')
    table.timestamp('date').notNullable()
    table.text('survey_id').references('id').inTable('surveys')
    table.text('meal_type')
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')

    table.index('device_id')
    table.index('habit_id')
    table.index('survey_id')
    table.index('date')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('logs')
  await knex.schema.dropTableIfExists('surveys')
  await knex.schema.dropTableIfExists('habits')
  await knex.schema.dropTableIfExists('devices')
}
