import type { Knex } from 'knex';

export class Repository {
  constructor(
    public readonly knex: Knex,
    public readonly tableName: string
  ) {
    this.knex = knex;
    this.tableName = tableName;
  }

  public get qb(): Knex.QueryBuilder {
    return this.knex(this.tableName);
  }

  getAllWithJoin(joinTable: string, joinColumn1: string, joinColumn2: string) {
    return this.qb.select().join(joinTable, joinColumn1, joinColumn2);
  }

  // eslint-disable-next-line class-methods-use-this
  addUserInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'users.id',
        'users.username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.email',
        'users.photo_url as photo',
        'users.contact_number1',
        'users.contact_number2',
        'users.bio',
        'users.base_id as baseId',
        'users.cell_id as cellId'
      );
  }

  withUserInfo = this.addUserInfoSelect();
}
