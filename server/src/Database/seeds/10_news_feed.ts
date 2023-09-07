import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE news RESTART IDENTITY CASCADE');
  // await knex('news_feed').del();
  await knex('news').insert([
    {
      title:
        'Air Force Spark Hub celebrates its one-year anniversary, commemorating a year of groundbreaking ideas and collaboration that have ignited innovation across the force.',
      date: '2020-01-01',
      cell_id: 1,
    },
    {
      title:
        'Spark Cell \'Avion-X\' wins prestigious award for their revolutionary unmanned aircraft design, poised to transform reconnaissance capabilities in contested environments.',
      date: '2020-01-02',
      cell_id: 1,
    },
    {
      title:
        'Tech Sergeant Maria Lopez conducts a virtual cybersecurity workshop, empowering airmen to proactively defend against cyber threats in the digital age.',
      date: '2020-01-03',
      cell_id: 1,
    },
    {
      title:
        'Spark Hub hosts its first-ever Ideathon, where airmen from all ranks pitch transformative concepts for the future of space exploration and national defense.',
      date: '2020-01-04',
      cell_id: 2,
    },
    {
      title:
        'Introducing \'SparkX\', a new initiative aimed at bridging cutting-edge commercial technologies with Air Force needs, fostering rapid tech integration.',
      date: '2020-01-05',
      cell_id: 2,
    },
    {
      title:
        'Dr. Emily Martinez delivers an inspiring TEDx talk on the potential of supersonic flight and its applications in global response missions.',
      date: '2020-01-06',
      cell_id: 2,
    },
    {
      title:
        'Spark Cell \'Quantum Force\' showcases quantum computing advancements, propelling data processing capabilities to unprecedented heights.',
      date: '2020-01-07',
      cell_id: 3,
    },
    {
      title:
        'Airman John Smith pioneers 3D-printed drone parts, reducing maintenance costs and increasing aircraft readiness in remote locations.',
      date: '2020-01-08',
      cell_id: 3,
    },
    {
      title:
        'Space Force Spark Cell \'CosmoTech\' collaborates with NASA, contributing to the development of sustainable life support systems for long-duration missions.',
      date: '2020-01-09',
      cell_id: 3,
    },
    {
      title:
        'Colonel Michael Johnson appointed as the new Director of Spark Hub, vowing to drive innovation and inspire airmen to reach even greater heights of excellence.',
      date: '2020-01-10',
      cell_id: 1,
    },
  ]);
}
