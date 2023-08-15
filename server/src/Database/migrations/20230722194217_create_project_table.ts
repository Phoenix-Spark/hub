import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('projects', table => {
    table.increments('id');
    table.integer('cell_id');
    table.foreign('cell_id').references('cells.id').onDelete('SET NULL');
    table.integer('proposed_by');
    table.foreign('proposed_by').references('users.id').onDelete('SET NULL');
    table.date('date_proposed');
    table.boolean('is_approved');
    table.date('date_approved');
    table.boolean('is_complete');
    table.date('date_complete');
    table.string('name', 64);
    table.string('description', 1024);
    table.string('budget', 64);
    table.string('asks_tasks', 512);
    table.string('comments');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('projects');
}
