/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE base RESTART IDENTITY CASCADE');
  // await knex('base').del()
  await knex('base').insert([
    { base_name: 'Travis AFB', lat: 38.273198309851736, lng: -121.94443455546879 },
    { base_name: 'Patrick SFB', lat: 28.255378133423037, lng: -80.60544844678353 },
    { base_name: 'Fort Buckner', lat: 26.295312530955673, lng: 127.77846327540517 },
    { base_name: 'Eglin AFB', lat: 30.47181687753664, lng: -86.53216619173087 },
    { base_name: 'Vandenberg SFB', lat: 34.756877297225476, lng: -120.55460661218399 },
    { base_name: 'Holloman AFB', lat: 32.85432412543247, lng: -106.08741650377451 },
    { base_name: 'Schwab AFB', lat: 26.37078968443826, lng: 127.84536009962545 },
    { base_name: 'Wright-Patterson AFB', lat: 39.82635921981985, lng: -84.0517722272022 },
    { base_name: 'Davis-Monthan AFB', lat: 32.16709149838944, lng: -110.87402192993953 },
    { base_name: 'Barksdale AFB', lat: 32.50197221642983, lng: -93.66219693641584 },
    { base_name: 'Peterson SFB', lat: 38.82246025336541, lng: -104.70621483086537 },
    { base_name: 'Cape Canaveral SFS', lat: 28.38918197456699, lng: -80.60318687253207 },
    { base_name: 'Luke AFB', lat: 33.52145094762851, lng: -112.37100528628154 },
    { base_name: 'Maxwell AFB', lat: 32.38449447246859, lng: -86.36524713721172 },
    { base_name: 'Cannon AFB', lat: 34.38589722393274, lng: -103.31810033082547 },
    { base_name: 'Hanscom AFB', lat: 42.461924857917596, lng: -71.28720697310018 },
    { base_name: 'Creech AFB', lat: 36.58113916638956, lng: -115.67473618077984 },
    { base_name: 'Offutt AFB', lat: 41.1228310149308, lng: -95.91559517742402 },
    { base_name: 'Hurlburt Field', lat: 30.427064836312994, lng: -86.6898696317113 },
    { base_name: 'Los Angeles AFB', lat: 33.9161722884335, lng: -118.37903684330648 },
    { base_name: 'Keesler AFB', lat: 30.412395741255126, lng: -88.92379816523135 },
    { base_name: 'Randolph AFB', lat: 29.53187911148933, lng: -98.27838793438157 },
    { base_name: 'Tinker AFB', lat: 35.41238183889909, lng: -97.39322502138606 },
    { base_name: 'McConnell AFB', lat: 37.62616042293943, lng: -97.26160408270825 },
    { base_name: 'Fort Lee', lat: 37.244470917557174, lng: -77.3374905374704 },
    { base_name: 'Dover AFB', lat: 39.12861741900317, lng: -75.45504921932934 },
    { base_name: 'Joint Base Lewis-McChord', lat: 47.108666232, lng: -122.558831098 },
  ]);
}
