/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('reply', table => {
    table.increments('id');
    table.integer('comment_id');
    table.foreign('comment_id').references('comment.id').onDelete('CASCADE');
    table.integer('users_id');
    table.foreign('users_id').references('users.id');
    table.string('body', 1024);
    table.datetime('create_time');
    table.boolean('is_edited');
    table.date('edit_time');
  });
}

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
export function down(knex) {
  return knex.schema.dropTableIfExists('reply');
}