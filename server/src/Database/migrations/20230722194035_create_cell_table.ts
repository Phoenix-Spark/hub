import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('cells', table => {
    table.increments('id');
    table.integer('base_id');
    table.foreign('base_id').references('bases.id');
    table.string('name', 64);
    table.string('endpoint', 64);
    table.string('external_website', 128);
    table.string('mission', 512);
    table.string('contact_number1', 16);
    table.string('contact_number2', 16);
    table.string('email', 64);
    table.string('logo_url', 128);
    table.string('is_approved', 64);
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('cell');
}
