import { Cell, CellAndBase, User } from '../types';
import { Repository } from './Repository';
import { ProjectStatus } from './ProjectRepository';

export class CellRepository extends Repository {
  // eslint-disable-next-line class-methods-use-this
  private cleanData(
    data: Cell & {
      base_id?: number;
      external_website?: string;
      contact_number1?: string;
      contact_number2?: string;
      logo_url?: string;
      is_approved?: boolean;
    }
  ) {
    data.baseId = data.base_id!;
    data.externalWebsite = data.external_website!;
    data.contactNumbers = [data.contact_number1!, data.contact_number2!];
    data.logoUrl = data.logo_url!;
    data.isApproved = data.is_approved!;

    delete data.base_id;
    delete data.external_website;
    delete data.contact_number1;
    delete data.contact_number2;
    delete data.logo_url;
    delete data.is_approved;

    return data;
  }

  async getAll(): Promise<Cell[]> {
    const data: Cell[] = await this.qb.select();

    data.forEach(item => this.cleanData(item));

    return data;
  }

  async getAllWithBases(): Promise<CellAndBase[]> {
    const data: CellAndBase[] = await this.qb
      .select('cells.*', 'bases.name as baseName', 'bases.id as baseId', 'bases.lat', 'bases.lng')
      .from('cells')
      .join('bases', 'bases.id', 'cells.id')
      .where('cells.is_approved', 'yes');

    data.forEach(item => this.cleanData(item));

    return data;
  }

  async findById(id: number): Promise<Cell> {
    const data = await this.qb.first().where('id', id);

    return this.cleanData(data);
  }

  async findByEndpoint(endpoint: string): Promise<Cell> {
    const data = await this.qb.first().where('endpoint', endpoint);

    return this.cleanData(data);
  }

  async getBaseByEndpoint(endpoint: string) {
    return this.qb
      .first('bases.id', 'bases.name')
      .join('bases', 'bases.id', 'cells.base_id')
      .where('cells.endpoint', endpoint);
  }

  async getTeamByEndpoint(endpoint: string) {
    const selectWithUserInfo = this.withUserInfo(this.qb);

    const data: User[] = await selectWithUserInfo
      .from('cells')
      .join('users', 'users.cell_id', '=', 'cells.id')
      .where('cells.endpoint', endpoint);

    data.forEach(
      (
        item: User & {
          contact_number1?: string;
          contact_number2?: string;
          // first_name?: string;
          // last_name?: string;
          // base_id?: number;
          // cell_id?: number;
          // photo_url?: string;
        }
      ) => {
        item.contactNumbers = [item.contact_number1!, item.contact_number2!];
        // item.firstName = item.first_name!;
        // item.lastName = item.last_name!;
        // item.baseId = item.base_id!;
        // item.cellId = item.cell_id!;
        // item.photo = item.photo_url!;

        delete item.contact_number1;
        delete item.contact_number2;
        // delete item.first_name;
        // delete item.last_name;
        // delete item.base_id;
        // delete item.cell_id;
        // delete item.photo_url;
      }
    );

    return data;
  }

  async getDetailsByEndpoint(endpoint: string) {
    const cell = await this.findByEndpoint(endpoint);

    const team = await this.getTeamByEndpoint(endpoint);

    const currentProjects = await this.getProjectsByStatus(endpoint, ProjectStatus.Current);

    const previousProjects = await this.getProjectsByStatus(endpoint, ProjectStatus.Completed);

    const base = await this.getBaseByEndpoint(endpoint);

    return { cell, team, currentProjects, previousProjects, base };
  }

  async getProjectsByStatus(endpoint: string, status: ProjectStatus) {
    let data = {};
    switch (status) {
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
