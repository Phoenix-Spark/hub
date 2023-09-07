import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE project_users CASCADE')
  await knex('project_users').del();
  await knex('project_users').insert([
    { project_id: 1, user_id: 1 },
    { project_id: 1, user_id: 2 },
    { project_id: 1, user_id: 3 },
    { project_id: 2, user_id: 1 },
    { project_id: 2, user_id: 2 },
    { project_id: 2, user_id: 3 },
    { project_id: 3, user_id: 1 },
    { project_id: 3, user_id: 2 },
    { project_id: 3, user_id: 3 },

    { project_id: 4, user_id: 4 },
    { project_id: 4, user_id: 5 },
    { project_id: 4, user_id: 6 },
    { project_id: 5, user_id: 4 },
    { project_id: 5, user_id: 5 },
    { project_id: 5, user_id: 6 },
    { project_id: 6, user_id: 4 },
    { project_id: 6, user_id: 5 },
    { project_id: 6, user_id: 6 },

    { project_id: 7, user_id: 7 },
    { project_id: 7, user_id: 8 },
    { project_id: 7, user_id: 9 },
    { project_id: 8, user_id: 7 },
    { project_id: 8, user_id: 8 },
    { project_id: 8, user_id: 9 },
    { project_id: 9, user_id: 7 },
    { project_id: 9, user_id: 8 },
    { project_id: 8, user_id: 9 },
  ]);
}
