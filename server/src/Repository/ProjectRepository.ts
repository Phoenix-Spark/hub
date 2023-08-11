import { Knex } from 'knex';
import { Project, ProjectPhoto, ProjectTag, User } from '../types';
import { Repository } from './Repository';

export class ProjectRepository extends Repository {
  // eslint-disable-next-line class-methods-use-this
  addProjectUserInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'projects.*',
        'users.id as user.id',
        'users.username as user.username',
        'users.first_name as user.firstName',
        'users.last_name as user.lastName',
        'users.photo_url as user.photo'
      );
  }

  withProjectUserInfo = this.addProjectUserInfoSelect();

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
  addUserInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'users.id as id',
        'users.username as username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.photo_url as photo'
      );
  }

  withUserInfo = this.addUserInfoSelect();

  // eslint-disable-next-line class-methods-use-this
  addTagInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query => query.select('tags.*');
  }

  withTagInfo = this.addTagInfoSelect();

  // eslint-disable-next-line class-methods-use-this
  addProjectPhotoInfoSelect(): (query: Knex.QueryBuilder) => Knex.QueryBuilder {
    return query =>
      query.select(
        'project_photo.url as url',
        'project_photo.index as index',
        'project_photo.name as name',
        'project_photo.description as description'
      );
  }

  withProjectPhotoInfo = this.addProjectPhotoInfoSelect();

  async getAll(): Promise<Project[]> {
    return this.qb.select();
  }

  async getApprovedByCellEndpoint(endpoint: string, isComplete = false): Promise<Project[]> {
    return this.getAllWithJoin('cells', 'cells.id', 'projects.cell_id')
      .where('cells.endpoint', endpoint)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', isComplete);
  }

  /**
   * Retreives proposed project by Cell ID or Endpoint
   */
  async getProposedByCellEndpoint(endpoint: string) {
    return this.withProjectUserInfo(this.qb)
      .from('projects')
      .join('cells', 'cells.id', 'projects.cell_id')
      .join('users', 'users.id', 'projects.proposed_by')
      .where('cells.endpoint', endpoint)
      .andWhere('projects.is_approved', null);
  }

  /**
   * Retreives proposed projects by User ID
   */
  async getProposedByUser(userId: number) {
    return this.withProjectUserInfo(this.qb)
      .join('users', 'users.id', 'projects.proposed_by')
      .where('users.id', userId)
      .andWhere('projects.is_approved', null);
  }

  async getCurrentByCellEndpoint(endpoint: string) {
    return this.withProjectUserInfo(this.qb)
      .from('projects')
      .join('cells', 'cells.id', 'projects.cell_id')
      .join('users', 'users.id', 'projects.proposed_by')
      .where('cells.endpoint', endpoint)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', false);
  }

  async getCurrentByUserId(userId: number) {
    return this.withProjectUserInfo(this.qb)
      .join('users', 'users.id', 'projects.proposed_by')
      .where('users.id', userId)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', false);
  }

  async getCompleteByCellEndpoint(endpoint: string) {
    return this.withProjectUserInfo(this.qb)
      .from('projects')
      .join('cells', 'cells.id', 'projects.cell_id')
      .join('users', 'users.id', 'projects.proposed_by')
      .where('cells.endpoint', endpoint)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', true);
  }

  async getCompleteByUserId(userId: number) {
    return this.withProjectUserInfo(this.qb)
      .join('users', 'users.id', 'projects.proposed_by')
      .where('users.id', userId)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', true);
  }

  async getAllProjectDetailsById(projectId: number | string): Promise<{
    project: Partial<Project>;
    users: Partial<User[]>;
    tags: ProjectTag[];
    photos: ProjectPhoto[];
  }> {
    if (typeof projectId === 'string') {
      projectId = parseInt(projectId, 10);
    }

    const project = await this.withProjectInfo(this.qb).first().where('projects.id', projectId);
    const users = await this.getProjectUsersById(projectId);
    const tags = await this.getProjectTagsById(projectId);
    const photos = await this.getProjectPhotosById(projectId);

    return { project, users, tags, photos };
  }

  async getProjectUsersById(projectId: number | string) {
    if (typeof projectId === 'string') {
      projectId = parseInt(projectId, 10);
    }

    return this.withUserInfo(this.qb)
      .join('project_users', 'projects.id', 'project_users.project_id')
      .join('users', 'users.id', 'project_users.user_id')
      .where('projects.id', projectId);
  }

  async getProjectTagsById(projectId: number | string) {
    if (typeof projectId === 'string') {
      projectId = parseInt(projectId, 10);
    }

    return this.withTagInfo(this.qb)
      .join('project_tag', 'projects.id', 'project_tag.project_id')
      .join('tags', 'tags.id', 'project_tag.tag_id')
      .where('projects.id', projectId);
  }

  async getProjectPhotosById(projectId: number | string) {
    if (typeof projectId === 'string') {
      projectId = parseInt(projectId, 10);
    }

    return this.withProjectPhotoInfo(this.qb)
      .join('project_photo', 'project_photo.project_id', 'projects.id')
      .where('projects.id', projectId);
  }
}
