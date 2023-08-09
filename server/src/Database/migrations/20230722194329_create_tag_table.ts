import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tags', table => {
    table.increments('id');
    table.string('name', 64);
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tag');
}
