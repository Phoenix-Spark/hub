/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE project_photo CASCADE')
  await knex('project_photo').del()
  await knex('project_photo').insert([
    {id: 1, project_id: 1, url: 'value', index: 1},
    {id: 2, project_id: 1, url: 'value', index: 2},
    {id: 3, project_id: 1, url: 'value', index: 3},

    {id: 4, project_id: 2, url: 'value', index: 1},
    {id: 5, project_id: 2, url: 'value', index: 2},
    {id: 6, project_id: 2, url: 'value', index: 3},

    {id: 7, project_id: 3, url: 'value', index: 1},
    {id: 8, project_id: 3, url: 'value', index: 2},
    {id: 9, project_id: 3, url: 'value', index: 3},

    {id: 10, project_id: 4, url: 'value', index: 1},
    {id: 11, project_id: 4, url: 'value', index: 2},
    {id: 12, project_id: 4, url: 'value', index: 3},

    {id: 13, project_id: 5, url: 'value', index: 1},
    {id: 14, project_id: 5, url: 'value', index: 2},
    {id: 15, project_id: 5, url: 'value', index: 3},

    {id: 16, project_id: 6, url: 'value', index: 1},
    {id: 17, project_id: 6, url: 'value', index: 2},
    {id: 18, project_id: 6, url: 'value', index: 3},

    {id: 19, project_id: 7, url: 'value', index: 1},
    {id: 20, project_id: 7, url: 'value', index: 2},
    {id: 21, project_id: 7, url: 'value', index: 3},

    {id: 22, project_id: 8, url: 'value', index: 1},
    {id: 23, project_id: 8, url: 'value', index: 2},
    {id: 24, project_id: 8, url: 'value', index: 3},

    {id: 25, project_id: 9, url: 'value', index: 1},
    {id: 26, project_id: 9, url: 'value', index: 2},
    {id: 27, project_id: 9, url: 'value', index: 3},
  ]);
};