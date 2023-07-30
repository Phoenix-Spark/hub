/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('faq', table => {
    table.increments('id');
    table.string('question', 128);
    table.string('answer', 1024);
  });
}

/**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
export function down(knex) {
  return knex.schema.dropTableIfExists('faq');
}