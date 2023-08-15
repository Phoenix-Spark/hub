import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('replies', table => {
    table.increments('id');
    table.integer('comment_id');
    table.foreign('comment_id').references('comments.id').onDelete('CASCADE');
    table.integer('user_id');
    table.foreign('user_id').references('users.id').onDelete('SET NULL');
    table.string('body', 1024);
    table.datetime('create_time');
    table.boolean('is_edited');
    table.date('edit_time');
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('replies');
}
