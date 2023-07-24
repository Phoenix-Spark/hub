/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE project_users CASCADE')
  await knex('project_users').del()
  await knex('project_users').insert([
    {id: 1, project_id: 1, users_id: 1},{id: 2, project_id: 1, users_id: 2},{id: 3, project_id: 1, users_id: 3},
    {id: 4, project_id: 2, users_id: 1},{id: 5, project_id: 2, users_id: 2},{id: 6, project_id: 2, users_id: 3},
    {id: 7, project_id: 3, users_id: 1},{id: 8, project_id: 3, users_id: 2},{id: 9, project_id: 3, users_id: 3},

    {id: 10, project_id: 4, users_id: 4},{id: 11, project_id: 4, users_id: 5},{id: 12, project_id: 4, users_id: 6},
    {id: 13, project_id: 5, users_id: 4},{id: 14, project_id: 5, users_id: 5},{id: 15, project_id: 5, users_id: 6},
    {id: 16, project_id: 6, users_id: 4},{id: 17, project_id: 6, users_id: 5},{id: 18, project_id: 6, users_id: 6},

    {id: 19, project_id: 7, users_id: 7},{id: 20, project_id: 7, users_id: 8},{id: 21, project_id: 7, users_id: 9},
    {id: 22, project_id: 8, users_id: 7},{id: 23, project_id: 8, users_id: 8},{id: 24, project_id: 8, users_id: 9},
    {id: 25, project_id: 9, users_id: 7},{id: 26, project_id: 9, users_id: 8},{id: 27, project_id: 8, users_id: 9},
  ]);
};