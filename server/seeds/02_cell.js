/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE cell CASCADE')
  await knex('cell').del()
  await knex('cell').insert([
    {base_id: 1, cell_name: 'Phoenix Spark', external_website: 'https://cell1website.com', cell_mission: 'Phoenix Spark is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', contact_number1: 'value', contact_number2: 'value', email: 'cell1@cell1.com', logo_url: './images/travis.png'},
    {base_id: 2, cell_name: 'Cell Name 2', external_website: 'https://cell2website.com', cell_mission: 'Cell 2 Mission Statement', contact_number1: 'value', contact_number2: 'value', email: 'cell2@cell2.com', logo_url: './images/placeholder_logo.svg'},
    {base_id: 3, cell_name: 'Cell Name 3', external_website: 'https://cell3website.com', cell_mission: 'Cell 3 Mission Statement', contact_number1: 'value', contact_number2: 'value', email: 'cell3@cell3.com', logo_url: './images/placeholder_logo.svg'},
  ]);
}