# server

Start a Postgres Container with an 'spark_hub' database.

  docker run --rm -e POSTGRES_PASSWORD=password -e POSTGRES_DB=spark_hub -it -p 5432:5432 postgres

From the ./server directory, install dependencies

  npm install

Use `migrate_seed_start` to migrate and seed the database and start the server.

  npm run migrate_seed_start
