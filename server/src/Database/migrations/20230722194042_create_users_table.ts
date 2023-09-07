import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.integer('base_id');
    table.foreign('base_id').references('bases.id').onDelete('SET NULL');
    table.integer('cell_id');
    table.foreign('cell_id').references('cells.id').onDelete('SET NULL');
    table.string('username', 32);
    table.string('password', 64);
    table.string('first_name', 32);
    table.string('last_name', 32);
    table.string('email', 64);
    table.string('photo_url', 128);
    table.string('contact_number1', 16);
    table.string('contact_number2', 16);
    table.string('bio', 768);
  });
}

export function down(knex: Knex): Promise<void> {
  // return knex.schema.dropTableIfExists('users');
  return knex.raw('DROP TABLE IF EXISTS users CASCADE');
}
