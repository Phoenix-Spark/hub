/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  // Permissions needed
  //  Site Admin
  //   - Full Rights to everything
  //  Cell Admin
  //   - Can manage Cell details
  //   - Cam manage All Projects assigned to Cell
  //   - Can Edit All Proposals to Cell
  //   - Inherits Project Team Lead
  //  Project Team Lead
  //   - Can manage Assigned Projects team members
  //   - Can manage Assigned Projects team details
  //   - Inherits Project User
  //  Project User
  //   - Can Edit Assigned Project
  //   - Inherits Registered
  //  Registered User
  //   - Can Submit Proposals
  //   - Can View Submitted Proposals
  //   - Inherits Non-Registered
  //  Non-Registered User
  //   - Can view all projects
  //   - Can view all cells

  // Assigned Project Read/Write
  // All Project Read/Write
  // project:rwa

  // Created Proposal Read/Write
  // All Proposal Read/Write
  // proposal:rwa

  // Assigned Cell Read/Write
  // All Cell Read/Write
  // cell:rwa

  await knex('permissions').del();
  await knex('permissions').insert([
    { users_id: 1, roles: '' }, // Registered - no projects or proposals
    { users_id: 2, roles: '' }, // Team Lead - has a project no proposal
    { users_id: 3, roles: 'cell' }, // Cell Admin - has a proposal

    { users_id: 4, roles: '' }, // Registered
    { users_id: 5, roles: '' }, // Team Lead
    { users_id: 6, roles: 'cell' }, // Cell Admin

    { users_id: 7, roles: '' }, // Registered
    { users_id: 8, roles: '' }, // Team Lead
    { users_id: 9, roles: 'cell' }, // Cell Admin
    { users_id: 10, roles: 'site' }, // SITE ADMIN
  ]);
}

export default seed;
