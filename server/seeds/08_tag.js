/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE tag CASCADE')
  await knex('tag').del()
  await knex('tag').insert([
    {id: 1, name: 'TAG 1'},
    {id: 2, name: 'TAG 2'},
    {id: 3, name: 'TAG 3'},
    {id: 4, name: 'TAG 4'},
    {id: 5, name: 'TAG 5'},
    {id: 6, name: 'TAG 6'},
    {id: 7, name: 'TAG 7'},
    {id: 8, name: 'TAG 8'},
    {id: 9, name: 'TAG 9'}
  ]);
};
