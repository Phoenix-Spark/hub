/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE comment RESTART IDENTITY CASCADE');
  // await knex('comment').del()
  const data = [];
  for(let i = 0; i < 60; i+=1)
  {
    data.push(
      {
        post_id: faker.number.int({ min: 1, max: 20 }),
        users_id: faker.number.int({ min: 1, max: 10 }),
        body: faker.lorem.paragraphs({ min: 1, max: 4 }),
        create_time: faker.date.recent({ days: 365 }),
        is_edited: false,
        edit_time: null,
      }
    );
  }
  await knex('comment').insert(data);
}