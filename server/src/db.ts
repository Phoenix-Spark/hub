import knex from 'knex';
import config from './Database/knexfile';

const db = knex(config.development);

export default db;
