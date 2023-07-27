/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE tag RESTART IDENTITY CASCADE');
  // await knex('tag').del();
  await knex('tag').insert([
    { name: 'TAG 1' },
    { name: 'TAG 2' },
    { name: 'TAG 3' },
    { name: 'TAG 4' },
    { name: 'TAG 5' },
    { name: 'TAG 6' },
    { name: 'TAG 7' },
    { name: 'TAG 8' },
    { name: 'TAG 9' },
  ]);
}
