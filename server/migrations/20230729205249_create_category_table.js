/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
*/
export function up(knex) {
  return knex.schema.createTable('category', table => {
    table.increments('id');
    table.string('name', 64);
    table.string('detail', 256);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('category');
}