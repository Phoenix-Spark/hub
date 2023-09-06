/* eslint-disable import/prefer-default-export */
import { Knex } from 'knex';
import { Base, Cell, CellAndBase, Project, Role, User, UserWithBaseAndCellName } from '../types';
import { Repository } from './Repository.js';

export class UserRepository extends Repository {
  // eslint-disable-next-line class-methods-use-this
  private addSingleUserSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.first(
        'users.id',
        'users.username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.email',
        'users.photo_url as photoUrl',
        'users.contact_number1 as contactNumber1',
        'users.contact_number2 as contactNumber2',
        'users.bio',
        'users.base_id as baseId',
        'users.cell_id as cellId'
      );
  }

  private withSingleUserInfo = this.addSingleUserSelect();

  async findById(id: number): Promise<User> {
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'cells.logo_url as cellLogoUrl')
      .join('cells', 'cells.id', 'users.cell_id')
      .where('users.id', id);

    data = this.createContactNumberArray<User>(data);

    return data;
  }

  async findByUsername(username: string): Promise<User> {
    let data = await this.withSingleUserInfo(this.qb).where('username', username);

    data = this.createContactNumberArray<User>(data);

    return data;
  }

  async findByIdWithBase(id: number): Promise<UserWithBaseAndCellName> {
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'bases.name as baseName')
      .join('cells', 'cells.id', 'users.cell_id')
      .join('bases', 'bases.id', 'users.base_id')
      .where('users.id', id);

    data = this.createContactNumberArray<User>(data);

    return data;
  }

  async findByUsernameWithBase(username: string): Promise<UserWithBaseAndCellName> {
    let data = await this.withSingleUserInfo(this.qb)
      .select('cells.name as cellName', 'bases.name as baseName')
      .join('cells', 'cells.id', 'users.cell_id')
      .join('bases', 'bases.id', 'users.base_id')
      .where('users.username', username);

    data = this.createContactNumberArray<User>(data);

    return data;
  }

  async getUserId(username: string): Promise<{ id: number }> {
    if (!username) {
      throw new Error('username is required');
    }
    return this.qb.first('id').from('users').where('users.username', username);
  }

  async getByCellEndpoint(endpoint: string): Promise<User[]> {
    const data: User[] = await this.withUserInfo(this.qb)
      .join('cells', 'cells.id', '=', 'users.cell_id')
      .where('cells.endpoint', endpoint);

    return data.map(item => this.createContactNumberArray<User>(item));
  }

  async getProjectsById(userId: number): Promise<Project[]> {
    return this.withProjectInfo(this.qb).from('projects').where('proposed_by', userId);
  }

  async findByUsernameWithPass(username: string): Promise<User> {
    if (!username) {
      throw new Error('Username is required');
    }

    return this.withSingleUserInfo(this.qb).select('password').where('username', username);
  }
  async getUserRoles(userId: number): Promise<Role[]> {
    const data = await this.qb.select('roles').from('permissions').where('user_id', userId).first();
    return data.roles;
  }

  async getBase(baseId: number): Promise<Base> {
    if (!baseId) {
      throw new Error('base id is required');
    }
    return this.qb.select().from('bases').where('id', baseId);
  }

  async getCell(cellId: number): Promise<Cell> {
    if (!cellId) {
      throw new Error('base id is required');
    }
    return this.qb.select().from('bases').where('id', cellId);
  }

  async getBaseAndCell(baseId: number, cellId: number): Promise<CellAndBase> {
    const base = await this.getBase(baseId);
    const cell = await this.getCell(cellId);

    return { base, cell };
  }
}
