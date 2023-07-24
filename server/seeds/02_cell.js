/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE cell CASCADE')
  await knex('cell').del()
  await knex('cell').insert([
    {base_id: 1, external_website: 'https://cell1website.com', cell_mission: 'Cell 1 Mission Statement', contact_number1: 'value', contact_number2: 'value', email: 'cell1@cell1.com', logo_url: 'value'},
    {base_id: 2, external_website: 'https://cell2website.com', cell_mission: 'Cell 2 Mission Statement', contact_number1: 'value', contact_number2: 'value', email: 'cell2@cell2.com', logo_url: 'value'},
    {base_id: 3, external_website: 'https://cell3website.com', cell_mission: 'Cell 3 Mission Statement', contact_number1: 'value', contact_number2: 'value', email: 'cell3@cell3.com', logo_url: 'value'},
  ]);
}