/* eslint-disable import/prefer-default-export */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE faq RESTART IDENTITY CASCADE');
  // await knex('faq').del()
  await knex('faq').insert(
    [
      {
        question: 'What is Spark Hub?',
        answer: 'Spark Hub is a platform for creative individuals to collaborate and share ideas.',
      },
      {
        question: 'How do I join Spark Hub?',
        answer: 'You can join Spark Hub by signing up for an account and becoming a member of our community.',
      },
      {
        question: 'Question 3?',
        answer: 'Answer 3.',
      },
    ]
  );
}