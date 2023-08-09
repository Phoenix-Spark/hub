import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE tags RESTART IDENTITY CASCADE');
  // await knex('tag').del();
  await knex('tags').insert([
    { name: 'Aerospace' },
    { name: 'Cybersecurity' },
    { name: 'Artificial Intelligence' },
    { name: 'Sustainability' },
    { name: 'Training & Simulation' },
    { name: 'Unmanned Systems' },
    { name: 'Energy Efficiency' },
    { name: 'Augmented Reality (AR) / Virtual Reality (VR)' },
    { name: '3-D Printing' },
    { name: 'Biometrics' },
  ]);
}
