/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE project_users CASCADE')
  await knex('project_users').del();
  await knex('project_users').insert([
    { project_id: 1, users_id: 1 },
    { project_id: 1, users_id: 2 },
    { project_id: 1, users_id: 3 },
    { project_id: 2, users_id: 1 },
    { project_id: 2, users_id: 2 },
    { project_id: 2, users_id: 3 },
    { project_id: 3, users_id: 1 },
    { project_id: 3, users_id: 2 },
    { project_id: 3, users_id: 3 },

    { project_id: 4, users_id: 4 },
    { project_id: 4, users_id: 5 },
    { project_id: 4, users_id: 6 },
    { project_id: 5, users_id: 4 },
    { project_id: 5, users_id: 5 },
    { project_id: 5, users_id: 6 },
    { project_id: 6, users_id: 4 },
    { project_id: 6, users_id: 5 },
    { project_id: 6, users_id: 6 },

    { project_id: 7, users_id: 7 },
    { project_id: 7, users_id: 8 },
    { project_id: 7, users_id: 9 },
    { project_id: 8, users_id: 7 },
    { project_id: 8, users_id: 8 },
    { project_id: 8, users_id: 9 },
    { project_id: 9, users_id: 7 },
    { project_id: 9, users_id: 8 },
    { project_id: 8, users_id: 9 },
  ]);
}
