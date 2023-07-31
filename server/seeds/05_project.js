/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE project RESTART IDENTITY CASCADE');
  // await knex('project').del()
  await knex('project').insert([
    {
      cell_id: 1,
      proposed_by: 1,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: true,
      date_complete: '2020-01-03',
      name: 'BioSense',
      description:
        'BioSense is a cutting-edge biometric authentication system that utilizes advanced AI algorithms to enhance security at Air Force installations. In this project, the Spark Cell aims to develop and implement a cost-effective solution that leverages facial recognition and fingerprint scanning technologies. By integrating BioSense across various access points, the Air Force can bolster its physical security measures and safeguard sensitive areas effectively.',
      budget: '35000',
      asks_tasks: 'value',
    },
    {
      cell_id: 1,
      proposed_by: 2,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: false,
      date_complete: null,
      name: 'DroneGuard',
      description:
        'An innovative drone security system that utilizes a network of affordable, off-the-shelf drones equipped with sensors and cameras to create a cost-effective aerial surveillance network. In this project, the Spark Cell aims to demonstrate the feasibility of using commercial drones as a distributed surveillance network. By leveraging affordable drone hardware and open-source software, DroneGuard will provide a scalable and low-cost solution for enhancing security and reconnaissance capabilities in critical areas.',
      budget: '50000',
      asks_tasks: 'value',
    },
    {
      cell_id: 1,
      proposed_by: 3,
      date_proposed: '2020-01-01',
      is_approved: null,
      date_approved: null,
      is_complete: false,
      date_complete: null,
      name: 'SmartBase',
      description:
        "SmartBase is an intelligent facility management system that optimizes energy consumption and resource utilization at Air Force bases. The Spark Cell's project objective is to deploy smart sensors and IoT devices across the base to monitor and control energy usage in real-time. By analyzing data patterns, SmartBase aims to identify efficiency opportunities, reduce operational costs, and promote sustainable practices within the Air Force.",
      budget: '45000',
      asks_tasks: 'value',
    },
    {
      cell_id: 1,
      proposed_by: 2,
      date_proposed: '2020-01-01',
      is_approved: null,
      date_approved: null,
      is_complete: false,
      date_complete: null,
      name: 'SmartBase v3',
      description:
        "SmartBase is an intelligent facility management system that optimizes energy consumption and resource utilization at Air Force bases. The Spark Cell's project objective is to deploy smart sensors and IoT devices across the base to monitor and control energy usage in real-time. By analyzing data patterns, SmartBase aims to identify efficiency opportunities, reduce operational costs, and promote sustainable practices within the Air Force.",
      budget: '45000',
      asks_tasks: 'value',
    },
    {
      cell_id: 1,
      proposed_by: 3,
      date_proposed: '2020-01-01',
      is_approved: null,
      date_approved: null,
      is_complete: false,
      date_complete: null,
      name: 'SmartBase v2',
      description:
        "SmartBase is an intelligent facility management system that optimizes energy consumption and resource utilization at Air Force bases. The Spark Cell's project objective is to deploy smart sensors and IoT devices across the base to monitor and control energy usage in real-time. By analyzing data patterns, SmartBase aims to identify efficiency opportunities, reduce operational costs, and promote sustainable practices within the Air Force.",
      budget: '45000',
      asks_tasks: 'value',
    },

    {
      cell_id: 2,
      proposed_by: 4,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: true,
      date_complete: '2020-01-03',
      name: 'TechAssist',
      description:
        'TechAssist is an innovative virtual training platform that utilizes augmented reality (AR) and virtual reality (VR) technologies to enhance technical training for Air Force personnel. In this project, the Spark Cell aims to develop a cost-effective and immersive training environment that simulates complex maintenance procedures. By providing interactive simulations and real-time feedback, TechAssist aims to accelerate skill development and boost the readiness of airmen in critical technical roles.',
      budget: '60000',
      asks_tasks: 'value',
    },
    {
      cell_id: 2,
      proposed_by: 5,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: false,
      date_complete: null,
      name: 'EcoWings',
      description:
        "EcoWings is an eco-friendly initiative aimed at integrating sustainable practices in Air Force aviation operations. The Spark Cell's project goal is to research and implement measures to reduce the carbon footprint of aircraft through alternative fuels and optimized flight routes. By promoting environmental responsibility, EcoWings seeks to contribute to the Air Force's commitment to a greener future and global sustainability efforts.",
      budget: '40000',
      asks_tasks: 'value',
    },
    {
      cell_id: 2,
      proposed_by: 6,
      date_proposed: '2020-01-01',
      is_approved: false,
      date_approved: null,
      is_complete: false,
      date_complete: null,
      name: 'RapidMedic',
      description:
        "RapidMedic is an innovative medical response system designed to enhance battlefield casualty care. The Spark Cell's project objective is to develop a lightweight and portable medical kit equipped with advanced telemedicine technology. By providing real-time communication with medical experts, RapidMedic aims to improve the triage and treatment of wounded personnel, increasing the chances of survival and reducing the impact of injuries in critical situations.",
      budget: '55000',
      asks_tasks: 'value',
    },

    {
      cell_id: 3,
      proposed_by: 7,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: true,
      date_complete: '2020-01-03',
      name: 'AeroSense',
      description:
        "AeroSense is an autonomous drone-based environmental monitoring system designed to assess and analyze Air Force base surroundings. The Spark Cell's project goal is to deploy a network of smart drones equipped with various sensors to gather real-time data on air quality, weather conditions, and wildlife activity. By leveraging AI algorithms, AeroSense aims to provide valuable insights that support informed decision-making for base operations and environmental conservation.",
      budget: '48000',
      asks_tasks: 'value',
    },
    {
      cell_id: 3,
      proposed_by: 8,
      date_proposed: '2020-01-01',
      is_approved: true,
      date_approved: '2020-01-02',
      is_complete: false,
      date_complete: null,
      name: 'CyberShield',
      description:
        "CyberShield is an advanced cybersecurity initiative that aims to bolster the Air Force's digital defenses against evolving cyber threats. In this project, the Spark Cell will develop and implement a comprehensive cybersecurity framework, incorporating cutting-edge encryption technologies and behavior analytics. By fortifying the Air Force's networks and systems, CyberShield aims to safeguard sensitive data and maintain a robust cyber posture in the face of ever-changing cyber threats.",
      budget: '65000',
      asks_tasks: 'value',
    },
    {
      cell_id: 3,
      proposed_by: 9,
      date_proposed: '2020-01-01',
      is_approved: false,
      date_approved: null,
      is_complete: false,
      date_complete: null,
      name: 'AirBot',
      description:
        "AirBot is an autonomous robotic maintenance system designed to optimize aircraft servicing and inspections. The Spark Cell's project objective is to develop a fleet of AI-driven robotic assistants capable of conducting routine maintenance tasks, reducing human workload, and increasing operational efficiency. By integrating AirBot into maintenance operations, the Air Force aims to streamline aircraft turnaround times and enhance overall fleet readiness.",
      budget: '58000',
      asks_tasks: 'value',
    },
  ]);
}
