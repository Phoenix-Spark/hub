import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('faqs', table => {
    table.increments('id');
    table.string('question', 128);
    table.string('answer', 1024);
    table.integer('asked_by');
    table.foreign('asked_by').references('users.id').onDelete('SET NULL');
    table.integer('answered_by');
    table.foreign('answered_by').references('users.id').onDelete('SET NULL');
  });
}
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('faqs');
}
