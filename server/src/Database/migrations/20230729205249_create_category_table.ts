import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('categories', table => {
    table.increments('id');
    table.string('name', 64);
    table.string('detail', 256);
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('categories');
}
