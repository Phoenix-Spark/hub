/* eslint-disable import/prefer-default-export */
import type { Knex } from 'knex';
import { ContactNumberArray } from '../types';

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
        'users.contact_number1 as contactNumber1',
        'users.contact_number2 as contactNumber2',
        'users.bio',
        'users.base_id as baseId',
        'users.cell_id as cellId'
      );
  }

  withUserInfo = this.addUserInfoSelect();

  // eslint-disable-next-line class-methods-use-this
  addProjectInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'projects.id as id',
        'projects.cell_id as cellId',
        'projects.proposed_by as proposedBy',
        'projects.date_proposed as dateProposed',
        'projects.is_approved as isApproved',
        'projects.date_approved as dateApproved',
        'projects.is_complete as isComplete',
        'projects.date_complete as dateComplete',
        'projects.name as name',
        'projects.description as description',
        'projects.budget as budget',
        'projects.asks_tasks as asksAndTasks',
        'projects.comments as comments'
      );
  }

  withProjectInfo = this.addProjectInfoSelect();

  // eslint-disable-next-line class-methods-use-this
  createContactNumberArray<T extends ContactNumberArray>(item: T): T {
    const newItem = { ...item };
    newItem.contactNumbers = [newItem.contactNumber1!, newItem.contactNumber2!];

    delete newItem.contactNumber1;
    delete newItem.contactNumber2;

    return newItem;
  }
}
