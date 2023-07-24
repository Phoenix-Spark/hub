/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE project_tag CASCADE')
  await knex('project_tag').del()
  await knex('project_tag').insert([
    {id: 1, project_id: 1, tag_id: 1},
    {id: 2, project_id: 1, tag_id: 2},
    {id: 3, project_id: 1, tag_id: 3},
    {id: 4, project_id: 2, tag_id: 4},
    {id: 5, project_id: 2, tag_id: 5},
    {id: 6, project_id: 2, tag_id: 6},
    {id: 7, project_id: 3, tag_id: 7},
    {id: 8, project_id: 3, tag_id: 8},
    {id: 9, project_id: 3, tag_id: 9},

    {id: 10, project_id: 4, tag_id: 1},
    {id: 11, project_id: 4, tag_id: 4},
    {id: 12, project_id: 4, tag_id: 7},
    {id: 13, project_id: 5, tag_id: 2},
    {id: 14, project_id: 5, tag_id: 5},
    {id: 15, project_id: 5, tag_id: 8},
    {id: 16, project_id: 6, tag_id: 3},
    {id: 17, project_id: 6, tag_id: 6},
    {id: 18, project_id: 6, tag_id: 9},

    {id: 19, project_id: 7, tag_id: 4},
    {id: 20, project_id: 7, tag_id: 5},
    {id: 21, project_id: 7, tag_id: 9},
    {id: 22, project_id: 8, tag_id: 7},
    {id: 23, project_id: 8, tag_id: 8},
    {id: 24, project_id: 8, tag_id: 3},
    {id: 25, project_id: 9, tag_id: 1},
    {id: 26, project_id: 9, tag_id: 2},
    {id: 27, project_id: 9, tag_id: 6}
  ]);
};