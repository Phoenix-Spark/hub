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
        asked_by: 1,
        answered_by: 10,
      },
      {
        question: 'How do I join Spark Hub?',
        answer: 'You can join Spark Hub by signing up for an account and becoming a member of our community.',
        asked_by: 2,
        answered_by: 10,
      },
      {
        question: 'Question 3?',
        answer: 'Answer 3.',
        asked_by: 3,
        answered_by: 10,
      },
      {
        question: 'Question 4?',
        answer: 'Answer 4.',
        asked_by: 4,
        answered_by: 10,
      },
      {
        question: 'Question 5?',
        answer: 'Answer 5.',
        asked_by: 5,
        answered_by: 10,
      },
      {
        question: 'Question 6?',
        answer: null,
        asked_by: 6,
        answered_by: 10,
      },
      {
        question: 'Inappropriate Question?',
        answer: null,
        asked_by: 7,
        answered_by: 10,
      },
    ]
  );
}