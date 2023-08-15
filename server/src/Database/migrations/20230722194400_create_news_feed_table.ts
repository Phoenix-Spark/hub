import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('news', table => {
    table.increments('id');
    table.string('title', 512);
    table.date('date');
    table.integer('cell_id');
    table.foreign('cell_id').references('cells.id').onDelete('CASCADE');
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('news');
}
