import { Knex } from 'knex';
import {
  Base,
  Cell,
  CellDetails,
  CellFromDbWithBase,
  CellWithBase,
  ContactNumberArray,
  NewsStory,
  Project,
  User,
  UserFromDb,
} from './index';
import { ProjectStatus } from '../Repository/ProjectRepository';

interface IRepository<T> {
  get qb(): Knex.QueryBuilder;

  getAllWithJoin(joinTable: string, joinColumn1: string, joinColumn2: string): Knex.QueryBuilder;

  // eslint-disable-next-line class-methods-use-this
  addUserInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder;

  withUserInfo: (query: Knex.QueryBuilder) => Knex.QueryBuilder;

  // eslint-disable-next-line class-methods-use-this
  addProjectInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder;

  withProjectInfo: (query: Knex.QueryBuilder) => Knex.QueryBuilder;

  // eslint-disable-next-line class-methods-use-this
  createContactNumberArray<TItem extends ContactNumberArray>(item: TItem): TItem;

  getAll(): Promise<T[]>;
}

export interface INewsRepository extends IRepository<NewsStory> {
  // getByBaseId(baseId: number): Promise<NewsStory[]>;
  getAllByCellId(cellId: number | string): Promise<NewsStory[]>;
  getAllByCellEndpoint(endpoint: string): Promise<NewsStory[]>;
}

export interface ICellRepository extends IRepository<Cell> {
  getAllWithBases(): Promise<CellWithBase[]>;

  findById(id: number): Promise<Cell>;

  findByEndpoint(endpoint: string): Promise<Cell>;

  getBaseByEndpoint(endpoint: string): Promise<Pick<Base, 'id' | 'name'>>;

  getTeamByEndpoint(endpoint: string): Promise<User[]>;

  getDetailsByEndpoint(endpoint: string): Promise<CellDetails>;

  getProjectsByStatus(endpoint: string, status: ProjectStatus): Promise<Project[]>;

  getNews(endpoint: string): Promise<NewsStory[]>;
}

export interface IUserRepository extends IRepository<User> {}

export interface IProjectRepository extends IRepository<Project> {}

export interface IBaseRepository extends IRepository<Base> {}

export default IRepository;
