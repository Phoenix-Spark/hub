import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('project_photo', table => {
    table.increments('id');
    table.integer('project_id');
    table.foreign('project_id').references('projects.id');
    table.string('url', 128);
    table.integer('index');
    table.string('name', 64);
    table.string('description', 128);
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('project_photo');
}
