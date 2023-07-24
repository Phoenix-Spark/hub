/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('permissions', table => {
    table.increments('id');
    table.integer('users_id');
    table.foreign('users_id').references('users.id');
    table.string('roles', 64);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('permissions');
}
