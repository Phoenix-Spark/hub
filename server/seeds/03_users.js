import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE users CASCADE')
  await knex('users').del();
  await knex('users').insert([
    {
      base_id: 1,
      cell_id: 1,
      username: 'jon',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Jon',
      last_name: 'M',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 1,
      cell_id: 1,
      username: 'kyle',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Kyle',
      last_name: 'K',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 1,
      cell_id: 1,
      username: 'alex',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Alex',
      last_name: 'W',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },

    {
      base_id: 2,
      cell_id: 2,
      username: 'david',
      password: bcrypt.hashSync('value', 10),
      first_name: 'David',
      last_name: 'F',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 2,
      cell_id: 2,
      username: 'sabrina',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Sabrina',
      last_name: 'J',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 2,
      cell_id: 2,
      username: 'michael',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Michael',
      last_name: 'B',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },

    {
      base_id: 3,
      cell_id: 3,
      username: 'james',
      password: bcrypt.hashSync('value', 10),
      first_name: 'James',
      last_name: 'A',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 3,
      cell_id: 3,
      username: 'dean',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Dean',
      last_name: 'G',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
    {
      base_id: 3,
      cell_id: 3,
      username: 'joe',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Joe',
      last_name: 'S',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '',
      contact_number2: '',
      bio: '',
    },
  ]);
}

export default seed;