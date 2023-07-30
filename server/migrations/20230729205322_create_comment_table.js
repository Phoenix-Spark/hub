/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('comment', table => {
    table.increments('id');
    table.integer('post_id');
    table.foreign('post_id').references('post.id');
    table.integer('users_id');
    table.foreign('users_id').references('users.id');
    table.string('body', 1024);
    table.date('create_time');
    table.boolean('is_edited');
    table.date('edit_time');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('comment');
}