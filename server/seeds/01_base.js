/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE base CASCADE')
  await knex('base').del()
  await knex('base').insert([
    {name: 'Base Name 1', lat: 1.23456, lng: 1.23456},
    {name: 'Base Name 2', lat: 1.23456, lng: 1.23456},
    {name: 'Base Name 3', lat: 1.23456, lng: 1.23456}
  ]);
}