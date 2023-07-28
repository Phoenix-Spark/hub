/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE news_feed CASCADE')
  await knex('news_feed').del();
  await knex('news_feed').insert([
    { news: 'Air Force Spark Hub celebrates its one-year anniversary, commemorating a year of groundbreaking ideas and collaboration that have ignited innovation across the force.', date: '2020-01-01' },
    { news: 'Spark Cell \'Avion-X\' wins prestigious award for their revolutionary unmanned aircraft design, poised to transform reconnaissance capabilities in contested environments.', date: '2020-01-02' },
    { news: 'Tech Sergeant Maria Lopez conducts a virtual cybersecurity workshop, empowering airmen to proactively defend against cyber threats in the digital age.', date: '2020-01-03' },
    { news: 'Spark Hub hosts its first-ever Ideathon, where airmen from all ranks pitch transformative concepts for the future of space exploration and national defense.', date: '2020-01-04' },
    { news: 'Introducing \'SparkX\', a new initiative aimed at bridging cutting-edge commercial technologies with Air Force needs, fostering rapid tech integration.', date: '2020-01-05' },
    { news: 'Dr. Emily Martinez delivers an inspiring TEDx talk on the potential of supersonic flight and its applications in global response missions.', date: '2020-01-06' },
    { news: 'Spark Cell \'Quantum Force\' showcases quantum computing advancements, propelling data processing capabilities to unprecedented heights.', date: '2020-01-07' },
    { news: 'Airman John Smith pioneers 3D-printed drone parts, reducing maintenance costs and increasing aircraft readiness in remote locations.', date: '2020-01-08' },
    { news: 'Space Force Spark Cell \'CosmoTech\' collaborates with NASA, contributing to the development of sustainable life support systems for long-duration missions.', date: '2020-01-09' },
    { news: 'Colonel Michael Johnson appointed as the new Director of Spark Hub, vowing to drive innovation and inspire airmen to reach even greater heights of excellence.', date: '2020-01-10' },
  ]);
}
