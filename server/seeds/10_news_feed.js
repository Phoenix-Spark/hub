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
    {news: 'value', date: '2020-01-03'},
    {news: 'value', date: '2020-01-04'},
    {news: 'value', date: '2020-01-05'},
    {news: 'value', date: '2020-01-06'},
    {news: 'value', date: '2020-01-07'},
    {news: 'value', date: '2020-01-08'},
    {news: 'value', date: '2020-01-09'},
    {news: 'value', date: '2020-01-10'}
  ]);
}