/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('news_feed', table => {
    table.increments('id');
    table.string('news', 512);
    table.date('date');
    table.integer('cell_id');
    table.foreign('cell_id').references('cell.id');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('news_feed');
}
