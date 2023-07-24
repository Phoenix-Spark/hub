/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
   //await knex.schema.raw('TRUNCATE users CASCADE')
  await knex('users').del()
  await knex('users').insert([
    {id: 1, base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 2, base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 3, base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},

    {id: 4, base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 5, base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 6, base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},

    {id: 7, base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 8, base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {id: 9, base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    ]);
};