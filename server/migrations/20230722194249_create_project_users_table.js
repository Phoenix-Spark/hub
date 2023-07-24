/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('project_users', (table) => {
        table.increments('id');
        table.integer('project_id');
        table.foreign('project_id').references('project.id');
        table.integer('users_id');
        table.foreign('users_id').references('users.id');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('project_users');
};