/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE post RESTART IDENTITY CASCADE');
  // await knex('post').del()
  const data = [];
  for(let i = 0; i < 20; i+=1)
  {
    data.push(
      {
        users_id: faker.number.int({ min: 1, max: 10 }),
        category_id: faker.number.int({ min: 1, max: 3 }),
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs({ min: 1, max: 5 }),
        create_time: faker.date.recent({ days: 365 }),
        is_edited: false,
        edit_time: null,
        views: 0,
      }
    );
  }
  await knex('post').insert(data);
}