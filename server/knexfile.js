/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
        client: 'postgresql',
        connection: process.env.DB_CONNECTION_STRING || 'postgresql://postgres:password@localhost:5432/spark_hub',
        //Uses the connection specified in the docker-compose file or defaults to the string.
    },


    staging: {
      client: 'postgresql',
      connection: {
        database: 'spark_hub',
        user:     'postgres',
        password: 'password'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },

    production: {
      client: 'postgresql',
      connection: {
        database: 'spark_hub',
        user:     'postgres',
        password: 'password'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }

  };
