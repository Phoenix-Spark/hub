/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id');
    table.integer('base_id');
    table.foreign('base_id').references('base.id');
    table.integer('cell_id');
    table.foreign('cell_id').references('cell.id');
    table.string('username', 32);
    table.string('password', 64);
    table.string('first_name', 32);
    table.string('last_name', 32);
    table.string('email', 64);
    table.string('photo_url', 128);
    table.string('contact_number1', 16);
    table.string('contact_number2', 16);
    table.string('bio', 256);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('users');
}
