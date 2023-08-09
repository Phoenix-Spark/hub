import { Knex } from 'knex';

export class Repository {
  db;
  constructor(db: Knex.QueryBuilder) {
    this.db = db;
  }

  getAllWithJoin(joinTable: string, joinColumn1: string, joinColumn2: string) {
    return this.db.select().join(joinTable, joinColumn1, joinColumn2);
  }
}
