/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE news_feed CASCADE')
  await knex('news_feed').del()
  await knex('news_feed').insert([
    {news: 'value', date: '2020-01-01'},
    {news: 'value', date: '2020-01-02'},
    {news: 'value', date: '2020-01-03'}
  ]);
}