/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE tag RESTART IDENTITY CASCADE');
  // await knex('tag').del();
  await knex('tag').insert([
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
