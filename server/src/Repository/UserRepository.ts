import { Knex } from 'knex';
import { Role, User } from '../types';
import { Repository } from './Repository.js';

export class UserRepository extends Repository {
  public result: object = {};
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
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'cells.logo_url as cellLogoUrl')
      .join('cells', 'cells.id', 'users.cell_id')
      .where('users.id', id);

    data = this.createContactNumberArray(data);

    return data;
  }

  async findByUsername(username: string): Promise<User> {
    let data = await this.withSingleUserInfo(this.qb).where('username', username);

    data = this.createContactNumberArray(data);

    return data;
  }

  async findByIdWithBase(id: number) {
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'bases.name as baseName')
      .join('cells', 'cells.id', 'users.cell_id')
      .join('bases', 'bases.id', 'users.base_id')
      .where('users.id', id);

    data = this.createContactNumberArray(data);

    return data;
  }

  async findByUsernameWithBase(username: string) {
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'bases.name as baseName')
      .join('cells', 'cells.id', 'users.cell_id')
      .join('bases', 'bases.id', 'users.base_id')
      .where('users.username', username);

    data = this.createContactNumberArray(data);

    return data;
  }

  async getUserId(username: string) {
    if (!username) {
      throw new Error('username is required');
    }
    return this.qb.first('id').from('users').where('users.username', username);
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

  async getProjectsById(userId: number) {
    return this.withProjectInfo(this.qb).from('projects').where('proposed_by', userId);
  }

  async findByUsernameWithPass(username: string) {
    if (!username) {
      throw new Error('Username is required');
    }

    return this.withSingleUserInfo(this.qb).select('password').where('username', username);
  }
  async getUserRoles(userId: number): Promise<Role[]> {
    const data = await this.qb.select('roles').from('permissions').where('user_id', userId).first();
    return data.roles;
  }

  async getBase(baseId: number) {
    if (!baseId) {
      throw new Error('base id is required');
    }
    return this.qb.select().from('bases').where('id', baseId);
  }

  async getCell(cellId: number) {
    if (!cellId) {
      throw new Error('base id is required');
    }
    return this.qb.select().from('bases').where('id', cellId);
  }

  async getBaseAndCell(baseId: number, cellId: number) {
    const base = await this.getBase(baseId);
    const cell = await this.getCell(cellId);

    return { base, cell };
  }
}
