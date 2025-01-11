import 'dotenv/config'
import type { Knex } from 'knex'

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './database.db',
    },
    migrations: {
      directory: './src/migrations',
    },
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: './database.db',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/migrations',
    },
  },
}

module.exports = config
