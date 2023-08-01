/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('cell', table => {
    table.increments('id');
    table.integer('base_id');
    table.foreign('base_id').references('base.id');
    table.string('cell_name', 64);
    table.string('cell_endpoint', 64);
    table.string('external_website', 128);
    table.string('cell_mission', 512);
    table.string('contact_number1', 16);
    table.string('contact_number2', 16);
    table.string('email', 64);
    table.string('logo_url', 128);
    table.string('is_approved', 64);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTableIfExists('cell');
}
