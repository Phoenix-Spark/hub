/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE project_tag CASCADE')
  await knex('project_tag').del()
  await knex('project_tag').insert([
    {project_id: 1, tag_id: 1},
    {project_id: 1, tag_id: 2},
    {project_id: 1, tag_id: 3},
    {project_id: 2, tag_id: 4},
    {project_id: 2, tag_id: 5},
    {project_id: 2, tag_id: 6},
    {project_id: 3, tag_id: 7},
    {project_id: 3, tag_id: 8},
    {project_id: 3, tag_id: 9},

    {project_id: 4, tag_id: 1},
    {project_id: 4, tag_id: 4},
    {project_id: 4, tag_id: 7},
    {project_id: 5, tag_id: 2},
    {project_id: 5, tag_id: 5},
    {project_id: 5, tag_id: 8},
    {project_id: 6, tag_id: 3},
    {project_id: 6, tag_id: 6},
    {project_id: 6, tag_id: 9},

    {project_id: 7, tag_id: 4},
    {project_id: 7, tag_id: 5},
    {project_id: 7, tag_id: 9},
    {project_id: 8, tag_id: 7},
    {project_id: 8, tag_id: 8},
    {project_id: 8, tag_id: 3},
    {project_id: 9, tag_id: 1},
    {project_id: 9, tag_id: 2},
    {project_id: 9, tag_id: 6}
  ]);
}