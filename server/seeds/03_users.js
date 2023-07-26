import bcrypt from 'bcrypt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
   //await knex.schema.raw('TRUNCATE users CASCADE')
  await knex('users').del()
  await knex('users').insert([
    {base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 1, cell_id: 1, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},

    {base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 2, cell_id: 2, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},

    {base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    {base_id: 3, cell_id: 3, username: 'value', password: 'value', first_name: 'value', last_name: 'value', email: 'value', photo_url: 'value', contact_number1: 'value', contact_number2: 'value', bio: 'value'},
    ]);
}

