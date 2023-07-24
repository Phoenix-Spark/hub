/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE news_feed CASCADE')
  await knex('news_feed').del()
  await knex('news_feed').insert([
    {id: 1, news: 'value', date: '2020-01-01'},
    {id: 2, news: 'value', date: '2020-01-02'},
    {id: 3, news: 'value', date: '2020-01-03'}
  ]);
};