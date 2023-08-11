import { Knex } from 'knex';
import { User } from '../types';
import { Repository } from './Repository';

export class UserRepository extends Repository {
  // selectUsersInfo() {
  //   return this.qb.select<User[]>(
  //     'users.id, ' +
  //       'users.username, ' +
  //       'users.first_name as firstName, ' +
  //       'users.last_name as lastName, ' +
  //       'users.email, ' +
  //       'users.photo_url as photo, ' +
  //       'users.contact_number1 as contactNumber1, ' +
  //       'users.contact_number2 as contactNumber2, ' +
  //       'users.bio, ' +
  //       'users.base_id as baseId, ' +
  //       'users.cell_id as cellId'
  //   );
  // }

  // getAllWithJoin(
  //   joinTable: string,
  //   joinColumn1: string,
  //   joinColumn2: string
  // ) {
  //   return this.db.select().join(joinTable, joinColumn1, joinColumn2).whereNot('is_approved', 'no');
  // }

  // eslint-disable-next-line class-methods-use-this
  addSingleUserSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.first(
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

  withSingleUserInfo = this.addSingleUserSelect();

  // eslint-disable-next-line class-methods-use-this
  createContactNumberArray(item: User & { contact_number1?: string; contact_number2?: string }) {
    const newItem = { ...item };
    newItem.contactNumbers = [newItem.contact_number1!, newItem.contact_number2!];

    delete newItem.contact_number1;
    delete newItem.contact_number2;

    return newItem;
  }

  async findById(id: number): Promise<User> {
    let data = await this.withSingleUserInfo(this.qb).where('id', id);

    data = this.createContactNumberArray(data);

    return data;
  }

  async findByUsername(username: string): Promise<User> {
    let data = await this.withSingleUserInfo(this.qb).where('username', username);

    data = this.createContactNumberArray(data);

    return data;
  }

  async getByCellEndpoint(endpoint: string): Promise<User[]> {
    const data = await this.withUserInfo(this.qb)
      .join('cells', 'cells.id', '=', 'users.cell_id')
      .where('cells.endpoint', endpoint);

    data.forEach(
      (
        item: User & {
          contact_number1?: string;
          contact_number2?: string;
        }
      ) => {
        this.createContactNumberArray(item);
      }
    );

    return data;
  }

  getProjectsById(userId: number) {
    return this.withProjectInfo(this.qb).from('projects').where('proposed_by', userId);
  }
}
