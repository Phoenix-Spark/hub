/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('post', table => {
    table.increments('id');
    table.integer('users_id');
    table.foreign('users_id').references('users.id');
    table.integer('category_id');
    table.foreign('category_id').references('category.id');
    table.string('title', 128);
    table.string('body', 1024);
    table.datetime('create_time');
    table.boolean('is_edited');
    table.datetime('edit_time');
    table.integer('views');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('post');
}