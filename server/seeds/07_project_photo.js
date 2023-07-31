/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE project_photo CASCADE')
  await knex('project_photo').del();
  await knex('project_photo').insert([
    { project_id: 1, url: 'https://cdn4.explainthatstuff.com/fingerprint-scanner.jpg', index: 1, name: 'Fingerprinting', description: 'Testing new equipment for integration.' },
    { project_id: 1, url: 'https://i.redd.it/i230pnpb8x751.jpg', index: 2, name: 'Prototyping', description: 'Testing in-house developed electronics.' },
    { project_id: 1, url: 'https://api.army.mil/e2/c/-images/2009/10/27/54333/army.mil-54333-2009-10-27-201054.jpg', index: 3, name: 'Installed', description: 'New equipment undergoing field-testing.' },

    { project_id: 2, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 2, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 2, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 3, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 3, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 3, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 4, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 4, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 4, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 5, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 5, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 5, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 6, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 6, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 6, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 7, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 7, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 7, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 8, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 8, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 8, url: '../logo512.png', index: 3, name: '', description: '' },

    { project_id: 9, url: '../logo512.png', index: 1, name: '', description: '' },
    { project_id: 9, url: '../logo512.png', index: 2, name: '', description: '' },
    { project_id: 9, url: '../logo512.png', index: 3, name: '', description: '' },
  ]);
}
