/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const development = {
  client: 'postgresql',
  connection: process.env.DB_CONN_STRING ?? 'postgresql://postgres:password@localhost:5432/spark_hub',
  // Uses the connection specified in the docker-compose file or defaults to the string.
};
export const staging = {
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
};
export const production = {
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
};
