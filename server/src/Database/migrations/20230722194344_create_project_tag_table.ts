import { Knex } from 'knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('project_tag', table => {
    table.increments('id');
    table.integer('project_id');
    table.foreign('project_id').references('projects.id').onDelete('CASCADE');
    table.integer('tag_id');
    table.foreign('tag_id').references('tags.id').onDelete('SET NULL');
  });
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('project_tag');
}
