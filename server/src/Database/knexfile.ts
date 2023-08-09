// eslint-disable-next-line import/no-import-module-exports
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection:
      process.env.DB_CONN_STRING ?? 'postgresql://postgres:password@localhost:5432/spark_hub',
    seeds: {
      directory: './seeds',
    },
    migrations: {
      directory: './migrations',
    },
    // Uses the connection specified in the docker-compose file or defaults to the string.
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'spark_hub',
      user: 'postgres',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection:
      process.env.DB_CONN_STRING ?? 'postgresql://postgres:password@localhost:5432/spark_hub',
  },
};

module.exports = config;
export default config;
