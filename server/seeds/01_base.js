/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  //await knex.schema.raw('TRUNCATE base CASCADE')
  await knex('base').del()
  await knex('base').insert([
    {base_name: 'Travis AFB', lat: 38.273198309851736, lng: -121.94443455546879},
    {base_name: 'Patrick SFB', lat: 28.255378133423037, lng: -80.60544844678353},
    {base_name: 'Fort Buckner', lat: 26.295312530955673, lng: 127.77846327540517},
  ]);
}