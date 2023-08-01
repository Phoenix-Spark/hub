/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('faq', table => {
    table.increments('id');
    table.string('question', 128);
    table.string('answer', 1024);
    table.integer('asked_by');
    table.foreign('asked_by').references('users.id');
    table.integer('answered_by');
    table.foreign('answered_by').references('users.id');
  });
}

/**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
export function down(knex) {
  return knex.schema.dropTableIfExists('faq');
}