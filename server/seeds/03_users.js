import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE users RESTART IDENTITY CASCADE');
  // await knex('users').del();
  // await knex.schema.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
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
      contact_number1: '123-555-6789',
      contact_number2: '456-555-9876',
      bio: 'With 12 years of dedicated service in the Air Force, Jon has been a driving force for innovation and technology integration within his squadrons. His passion for Spark Cells lies in exploring unmanned aerial systems (UAS) for reconnaissance and surveillance, and he actively seeks opportunities to collaborate with fellow airmen to optimize UAS capabilities. When not in uniform, Jon enjoys tinkering with DIY electronics and is an avid drone enthusiast.',
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
      contact_number1: '987-555-4321',
      contact_number2: '654-555-7890',
      bio: 'With 8 years of experience in the Space Force, Kyle is a skilled data analyst specializing in satellite communication systems. His interest in Spark Cells revolves around utilizing artificial intelligence and machine learning algorithms to enhance space-based data processing and decision-making capabilities. Off-duty, Kyle is an adventure seeker, often seen exploring national parks and capturing breathtaking landscapes through photography.',
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
      contact_number1: '789-555-0123',
      contact_number2: '210-555-3456',
      bio: 'As a seasoned intelligence analyst with 8 years of experience in the Air Force, Alex\'s keen eye for patterns and trends drives their interest in Spark Cells. Alex actively engages with the community to explore how artificial intelligence and machine learning can revolutionize intelligence gathering and analysis. Beyond their military role, Alex is a fitness enthusiast and enjoys leading group workouts to promote camaraderie and well-being among fellow airmen.',
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
      contact_number1: '543-555-8765',
      contact_number2: '678-555-3210',
      bio: 'With 5 years of experience in the Space Force, David\'s primary interest in Spark Cells lies in optimizing human-machine interfaces and advancing autonomous flight capabilities. He actively collaborates with other Spark Cell members to explore the safe integration of AI-powered systems in aviation. Off-duty, David is an adrenaline junkie, enjoying skydiving and competitive drone racing as his favorite pastimes.',
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
      contact_number1: '234-555-5678',
      contact_number2: '876-555-9012',
      bio: 'A cybersecurity expert with 10 years of service in the Air Force, Sabrina is passionate about ensuring the Air Force\'s digital infrastructure remains secure and resilient. She actively contributes to Spark Cells by organizing workshops on cybersecurity best practices and encouraging a cyber-aware culture across the force. Outside of work, Sabrina enjoys participating in hackathons and coding competitions.',
    },
    {
      base_id: 2,
      cell_id: 2,
      username: 'michael',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Michael',
      last_name: 'Johnson',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '345-555-7890',
      contact_number2: '109-555-2345',
      bio: 'With 12 years of dedicated service in the Air Force, TSgt. Johnson is a highly skilled avionics technician known for his attention to detail and problem-solving abilities. He actively contributes to Spark Cells by proposing innovative ways to streamline aircraft maintenance processes through advanced diagnostics and digital tools. Off-duty, Michael is an amateur radio enthusiast and volunteers as a mentor for young aviation enthusiasts, nurturing their interest in aerospace technology and engineering.',
    },
    {
      base_id: 3,
      cell_id: 3,
      username: 'james',
      password: bcrypt.hashSync('value', 10),
      first_name: 'James',
      last_name: 'Anderson',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '567-555-9012',
      contact_number2: '890-555-4567',
      bio: 'With 7 years of distinguished service as an aircraft maintenance officer in the Air Force, Lt. Anderson has a keen interest in driving innovation in aircraft maintenance practices. He actively engages with Spark Cells to develop predictive maintenance solutions, reducing downtime and enhancing fleet readiness. Off duty, James is an aviation history buff and spends his weekends volunteering at aviation museums.',
    },
    {
      base_id: 3,
      cell_id: 3,
      username: 'dean',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Dean',
      last_name: 'Roberts',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '876-555-2345',
      contact_number2: '321-555-6789',
      bio: 'As a skilled aviator with 9 years of experience in the Air Force, Capt. Roberts is deeply invested in leveraging virtual reality (VR) and simulation technologies to enhance pilot training programs. His active involvement in Spark Cells centers around creating immersive training environments that optimize learning outcomes and increase mission success rates. Beyond his flying duties, Dean enjoys hiking and camping in the great outdoors.',
    },
    {
      base_id: 3,
      cell_id: 3,
      username: 'joe',
      password: bcrypt.hashSync('value', 10),
      first_name: 'Joe',
      last_name: 'Ramirez',
      email: 'some@email.com',
      photo_url: faker.image.avatarGitHub(),
      contact_number1: '901-555-4567',
      contact_number2: '543-555-8901',
      bio: 'With an impressive 14 years of service in the Air Force, MSgt. Ramirez is an expert in aerial reconnaissance and intelligence analysis. His commitment to Spark Cells revolves around harnessing the potential of big data analytics and satellite imagery to bolster situational awareness on the battlefield. Outside of his military responsibilities, Joe is a skilled woodworker and enjoys crafting custom furniture in his spare time.',
    },
    {
      // *********************************************
      // THIS IS THE SEEDED SITE ADMIN FOR TESTING
      // TODO: REMOVE BEFORE DEPLOYMENT
      // *********************************************
      base_id: 1,
      cell_id: 1,
      username: 'rick',
      password: bcrypt.hashSync('supersecret', 10),
      first_name: 'Rick',
      last_name: 'Sanchez',
      email: 'some@email.com',
      photo_url: 'https://pm1.narvii.com/6450/2f24804e66bd3d4449a2619f2d422ade180ce78c_00.jpg',
      contact_number1: '210-555-3456',
      contact_number2: '432-555-9876',
      bio: 'With an infinite number of adventures across the multiverse, Rick is a multidimensional genius scientist and a self-proclaimed "Smartest Man in the Universe." He occasionally visits Spark Cells in various realities to share groundbreaking ideas and technologies from his intergalactic escapades. Though often engaged in eccentric scientific pursuits, Rick\'s interests in Spark Cells lie in developing portal technology to access new dimensions of knowledge and innovation. When he\'s not traversing the cosmos, Rick enjoys brewing homemade concoctions in his garage-laboratory and bonding with his grandson, Morty, over interdimensional escapades. Wubba lubba dub dub!',
    },
  ]);
}

export default seed;
