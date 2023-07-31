/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE category RESTART IDENTITY CASCADE');
  // await knex('category').del()
  await knex('category').insert([
    { name: 'Project Ideas', detail: 'Share and discuss ideas for new projects.' },
    { name: 'Collaboration', detail: 'Discuss current projects and share information.' },
    { name: 'Support', detail: 'Technical support for the website and account issues.' },
  ]);
}