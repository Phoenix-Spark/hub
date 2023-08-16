import { Knex } from 'knex';
import {
  Base,
  Cell,
  CellDetails,
  CellFromDbWithBase,
  CellWithBase,
  Project,
  User,
  UserFromDb,
} from '../types';
import { Repository } from './Repository.js';
import { ProjectStatus } from './ProjectRepository.js';
import { ICellRepository } from '../types/IRepository.js';

export class CellRepository extends Repository<Cell> implements ICellRepository {
  // eslint-disable-next-line class-methods-use-this
  private addCellInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'cells.id',
        'cells.base_id as baseId',
        'cells.name',
        'cells.endpoint',
        'cells.external_website as externalWebsite',
        'cells.mission',
        'cells.contact_number1 as contactNumber1',
        'cells.contact_number2 as contactNumber2',
        'cells.email',
        'cells.logo_url as logoUrl',
        'cells.is_approved as isApproved'
      );
  }

  private withCellInfoSelect = this.addCellInfoSelect();

  // eslint-disable-next-line class-methods-use-this
  private addSingleCellInfo(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.first(
        'cells.id',
        'cells.base_id as baseId',
        'cells.name',
        'cells.endpoint',
        'cells.external_website as externalWebsite',
        'cells.mission',
        'cells.contact_number1 as contactNumber1',
        'cells.contact_number2 as contactNumber2',
        'cells.email',
        'cells.logo_url as logoUrl',
        'cells.is_approved as isApproved'
      );
  }

  withSingleCellInfo = this.addSingleCellInfo();

  async getAll(): Promise<Cell[]> {
    const data: Cell[] = await this.withCellInfoSelect(this.qb);

    return data.map(item => this.createContactNumberArray<Cell>(item));
  }

  async getAllWithBases(): Promise<CellWithBase[]> {
    const data: CellFromDbWithBase[] = await this.withCellInfoSelect(this.qb)
      .select('bases.name as baseName', 'bases.id as baseId', 'bases.lat', 'bases.lng')
      .from('cells')
      .join('bases', 'bases.id', 'cells.id')
      .where('cells.is_approved', 'yes');

    return data.map(item => this.createContactNumberArray<CellFromDbWithBase>(item));
  }

  async findById(id: number): Promise<Cell> {
    const data = await this.withSingleCellInfo(this.qb).where('id', id);

    return this.createContactNumberArray(data);
  }

  async findByEndpoint(endpoint: string): Promise<Cell> {
    const data = await this.withSingleCellInfo(this.qb).where('endpoint', endpoint);

    return this.createContactNumberArray<Cell>(data);
  }

  async getBaseByEndpoint(endpoint: string): Promise<Pick<Base, 'id' | 'name'>> {
    return this.qb
      .first('bases.id', 'bases.name')
      .join('bases', 'bases.id', 'cells.base_id')
      .where('cells.endpoint', endpoint);
  }

  async getTeamByEndpoint(endpoint: string): Promise<User[]> {
    const data: UserFromDb[] = await this.withUserInfo(this.qb)
      .from('cells')
      .join('users', 'users.cell_id', '=', 'cells.id')
      .where('cells.endpoint', endpoint);

    return data.map(item => this.createContactNumberArray<User>(item));
  }

  async getDetailsByEndpoint(endpoint: string): Promise<CellDetails> {
    const cell = await this.findByEndpoint(endpoint);

    const team = await this.getTeamByEndpoint(endpoint);

    const currentProjects = await this.getProjectsByStatus(endpoint, ProjectStatus.Current);

    const previousProjects = await this.getProjectsByStatus(endpoint, ProjectStatus.Completed);

    const base = await this.getBaseByEndpoint(endpoint);

    return { cell, team, currentProjects, previousProjects, base };
  }

  async getProjectsByStatus(endpoint: string, status: ProjectStatus): Promise<Project[]> {
    let data;
    switch (status as string) {
      case ProjectStatus.Current:
        data = await this.withProjectInfo(this.qb)
          .join('projects', 'projects.cell_id', 'cells.id')
          .where('cells.endpoint', endpoint)
          .andWhere('projects.is_approved', true)
          .andWhere('projects.is_complete', false);
        break;
      case ProjectStatus.Completed:
        data = await this.withProjectInfo(this.qb)
          .join('projects', 'projects.cell_id', 'cells.id')
          .where('cells.endpoint', endpoint)
          .andWhere('projects.is_approved', true)
          .andWhere('projects.is_complete', true);
        break;
      case ProjectStatus.Pending:
        data = await this.withProjectInfo(this.qb)
          .join('projects', 'projects.cell_id', 'cells.id')
          .where('cells.endpoint', endpoint)
          .andWhere('projects.is_approved', null);
        break;
      case ProjectStatus.Denied:
        break;
      default:
        break;
    }

    return data;
  }

  async getNews(endpoint: string) {
    return this.qb
      .select('news.id', 'news.cell_id as cellId', 'news.title', 'news.date')
      .join('news', 'news.cell_id', 'cells.id')
      .where('cells.endpoint', endpoint);
  }
}
