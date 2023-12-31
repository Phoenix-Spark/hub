import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE cells RESTART IDENTITY CASCADE');
  // await knex('cell').del()
  await knex('cells').insert([
    {
      base_id: 1,
      name: 'Phoenix Spark',
      endpoint: 'travis',
      external_website: 'https://cell1website.com',
      mission:
        'Empowering Phoenix Spark Cell to be the driving force behind disruptive innovation, leveraging emerging technologies and novel approaches to propel the Air Force\'s capabilities forward. Together, we ignite a spark of ingenuity that shapes the future of aerospace and national defense.',
      contact_number1: '768-555-4321',
      contact_number2: '123-555-9876',
      email: 'cell1@cell1.com',
      logo_url: '/images/travis.png',
      is_approved: 'yes',
    },
    {
      base_id: 2,
      name: 'The Forge',
      endpoint: 'patrick',
      external_website: 'https://cell2website.com',
      mission:
        'Uniting the talents and expertise of The Forge Spark Cell to foster a culture of collaboration, where guardians from diverse backgrounds come together to co-create transformative solutions. Our mission is to amplify collective intelligence, accelerating the pace of progress and ensuring the Space Force remains at the forefront of cutting-edge advancements',
      contact_number1: '987-555-2109',
      contact_number2: '876-555-5432',
      email: 'cell2@cell2.com',
      logo_url: '/images/placeholder_logo.svg',
      is_approved: 'yes',
    },
    {
      base_id: 3,
      name: 'Buckner Spark',
      endpoint: 'buckner',
      external_website: 'https://cell3website.com',
      mission:
        'Embracing adaptability and forward-thinking, Buckner Spark Cell is committed to driving continuous improvement and operational excellence across the Air and Space Force. Through rapid experimentation and iterative problem-solving, we spark the flames of agility, ensuring the Air and Space Forces maintain their unrivaled position in national defense.',
      contact_number1: '234-555-6789',
      contact_number2: '345-555-9012',
      email: 'cell3@cell3.com',
      logo_url: '/images/placeholder_logo.svg',
      is_approved: 'yes',
    },
    {
      base_id: 4,
      name: 'Eglin Spark',
      endpoint: 'eglin',
      external_website: 'https://cell4website.com',
      mission: 'tbd',
      contact_number1: '234-525-6789',
      contact_number2: '345-535-9012',
      email: 'cell4@cell4.com',
      logo_url: '/images/placeholder_logo.svg',
      is_approved: 'no',
    },
    {
      base_id: 5,
      name: 'Spark in Space',
      endpoint: 'vandenberg',
      external_website: 'https://cell5website.com',
      mission: 'To be way better than any lame air force spark cell',
      contact_number1: '666-525-6789',
      contact_number2: '666-535-9012',
      email: 'cell5@cell5.com',
      logo_url: '/images/placeholder_logo.svg',
      is_approved: 'no',
    },
  ]);
}
