import 'dotenv/config'
import knex from 'knex'

export default knex({
  client: 'better-sqlite3',
  connection: {
    filename: './database.db',
  },
})
