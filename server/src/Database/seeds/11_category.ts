import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE categories RESTART IDENTITY CASCADE');
  // await knex('category').del()
  await knex('categories').insert([
    { name: 'Project Ideas', detail: 'Share and discuss ideas for new projects.' },
    { name: 'Collaboration', detail: 'Discuss current projects and share information.' },
    { name: 'Support', detail: 'Technical support for the website and account issues.' },
  ]);
}
