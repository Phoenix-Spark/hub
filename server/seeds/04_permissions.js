/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
   //await knex.schema.raw('TRUNCATE permissions CASCADE')
  await knex('permissions').del()
  await knex('permissions').insert([
    {users_id: 1, roles: 'value'},
    {users_id: 2, roles: 'value'},
    {users_id: 3, roles: 'value'},

    {users_id: 4, roles: 'value'},
    {users_id: 5, roles: 'value'},
    {users_id: 6, roles: 'value'},

    {users_id: 7, roles: 'value'},
    {users_id: 8, roles: 'value'},
    {users_id: 9, roles: 'value'},
  ]);
}