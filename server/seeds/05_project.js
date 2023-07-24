/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE project CASCADE')
  await knex('project').del()
  await knex('project').insert([
    {cell_id: 1, proposed_by: 1, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: true, date_complete: '2020-01-03', name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 1, proposed_by: 2, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 1, proposed_by: 3, date_proposed: '2020-01-01', is_approved: false, date_approved: null, is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},

    {cell_id: 2, proposed_by: 4, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: true, date_complete: '2020-01-03', name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 2, proposed_by: 5, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 2, proposed_by: 6, date_proposed: '2020-01-01', is_approved: false, date_approved: null, is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},

    {cell_id: 3, proposed_by: 7, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: true, date_complete: '2020-01-03', name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 3, proposed_by: 8, date_proposed: '2020-01-01', is_approved: true, date_approved: '2020-01-02', is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'},
    {cell_id: 3, proposed_by: 9, date_proposed: '2020-01-01', is_approved: false, date_approved: null, is_complete: false, date_complete: null, name: 'value', description: 'value', budget: 'value', asks_tasks: 'value'}
  ]);
}
