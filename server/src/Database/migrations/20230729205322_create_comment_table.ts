import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', table => {
    table.increments('id');
    table.integer('post_id');
    table.foreign('post_id').references('posts.id').onDelete('CASCADE');
    table.integer('user_id');
    table.foreign('user_id').references('users.id');
    table.string('body', 1024);
    table.datetime('create_time');
    table.boolean('is_edited');
    table.date('edit_time');
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('comments');
}
