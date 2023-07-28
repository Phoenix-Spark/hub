/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // await knex.schema.raw('TRUNCATE project_photo CASCADE')
  await knex('project_photo').del();
  await knex('project_photo').insert([
    { project_id: 1, url: '../logo512.png', index: 1 },
    { project_id: 1, url: '../logo512.png', index: 2 },
    { project_id: 1, url: '../logo512.png', index: 3 },

    { project_id: 2, url: '../logo512.png', index: 1 },
    { project_id: 2, url: '../logo512.png', index: 2 },
    { project_id: 2, url: '../logo512.png', index: 3 },

    { project_id: 3, url: '../logo512.png', index: 1 },
    { project_id: 3, url: '../logo512.png', index: 2 },
    { project_id: 3, url: '../logo512.png', index: 3 },

    { project_id: 4, url: '../logo512.png', index: 1 },
    { project_id: 4, url: '../logo512.png', index: 2 },
    { project_id: 4, url: '../logo512.png', index: 3 },

    { project_id: 5, url: '../logo512.png', index: 1 },
    { project_id: 5, url: '../logo512.png', index: 2 },
    { project_id: 5, url: '../logo512.png', index: 3 },

    { project_id: 6, url: '../logo512.png', index: 1 },
    { project_id: 6, url: '../logo512.png', index: 2 },
    { project_id: 6, url: '../logo512.png', index: 3 },

    { project_id: 7, url: '../logo512.png', index: 1 },
    { project_id: 7, url: '../logo512.png', index: 2 },
    { project_id: 7, url: '../logo512.png', index: 3 },

    { project_id: 8, url: '../logo512.png', index: 1 },
    { project_id: 8, url: '../logo512.png', index: 2 },
    { project_id: 8, url: '../logo512.png', index: 3 },

    { project_id: 9, url: '../logo512.png', index: 1 },
    { project_id: 9, url: '../logo512.png', index: 2 },
    { project_id: 9, url: '../logo512.png', index: 3 },
  ]);
}
