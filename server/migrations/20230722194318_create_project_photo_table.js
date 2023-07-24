/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('project_photo', (table) => {
        table.increments('id');
        table.integer('project_id');
        table.foreign('project_id').references('project.id');
        table.string('url', 128);
        table.integer('index');
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('project_photo');
}