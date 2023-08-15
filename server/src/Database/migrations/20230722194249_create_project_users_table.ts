import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('project_users', table => {
    table.increments('id');
    table.integer('project_id');
    table.foreign('project_id').references('projects.id').onDelete('SET NULL');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('project_users');
}
