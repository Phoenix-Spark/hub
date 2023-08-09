import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', table => {
    table.increments('id');
    table.integer('user_id');
    table.foreign('user_id').references('users.id');
    table.integer('category_id');
    table.foreign('category_id').references('categories.id');
    table.string('title', 128);
    table.string('body', 1024);
    table.datetime('create_time');
    table.boolean('is_edited');
    table.datetime('edit_time');
    table.integer('views');
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('posts');
}
