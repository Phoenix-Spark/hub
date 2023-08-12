import knex from 'knex';
import config from './Database/knexfile.js';

const db = knex(config.development);

export default db;
