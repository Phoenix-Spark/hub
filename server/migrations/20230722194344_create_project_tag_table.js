/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('project_tag', (table) => {
        table.increments('id');
        table.integer('project_id');
        table.foreign('project_id').references('project.id');
        table.integer('tag_id');
        table.foreign('tag_id').references('tag.id');
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('project_tag');
}