/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('project', table => {
    table.increments('id');
    table.integer('cell_id');
    table.foreign('cell_id').references('cell.id');
    table.integer('proposed_by');
    table.foreign('proposed_by').references('users.id');
    table.date('date_proposed');
    table.boolean('is_approved');
    table.date('date_approved');
    table.boolean('is_complete');
    table.date('date_complete');
    table.string('name', 64);
    table.string('description', 512);
    table.string('budget', 64);
    table.string('asks_tasks', 512);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('project');
}
