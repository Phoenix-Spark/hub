/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE replies RESTART IDENTITY CASCADE');
  // await knex('reply').del()
  const data = [];
  for (let i = 0; i < 120; i += 1) {
    data.push({
      comment_id: faker.number.int({ min: 1, max: 60 }),
      user_id: faker.number.int({ min: 1, max: 10 }),
      body: faker.lorem.paragraphs({ min: 1, max: 2 }),
      create_time: faker.date.recent({ days: 365 }),
      is_edited: false,
      edit_time: null,
    });
  }
  await knex('replies').insert(data);
}
