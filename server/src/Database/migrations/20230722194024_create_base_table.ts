import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bases', table => {
    table.increments('id');
    table.string('name', 64);
    table.double('lat');
    table.double('lng');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('base');
}
