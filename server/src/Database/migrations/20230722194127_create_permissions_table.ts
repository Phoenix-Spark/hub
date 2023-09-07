import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('permissions', table => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.string('roles', 64);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('permissions');
}
