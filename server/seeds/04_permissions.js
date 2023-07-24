/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
   //await knex.schema.raw('TRUNCATE permissions CASCADE')
  await knex('permissions').del()
  await knex('permissions').insert([
    {id: 1, users_id: 1, roles: 'value'},
    {id: 2, users_id: 2, roles: 'value'},
    {id: 3, users_id: 3, roles: 'value'},

    {id: 4, users_id: 4, roles: 'value'},
    {id: 5, users_id: 5, roles: 'value'},
    {id: 6, users_id: 6, roles: 'value'},

    {id: 7, users_id: 7, roles: 'value'},
    {id: 8, users_id: 8, roles: 'value'},
    {id: 9, users_id: 9, roles: 'value'},
  ]);
};