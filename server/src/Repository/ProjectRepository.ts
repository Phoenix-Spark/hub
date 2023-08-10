import { Project } from '../types';
import { Repository } from './Repository';

export class ProjectRepository extends Repository {
  async getAll(): Promise<Project[]> {
    return this.qb.select();
  }

  async getAllByCellEndpoint(endpoint: string, isComplete = false): Promise<Project[]> {
    return this.getAllWithJoin('cells', 'cells.id', 'projects.cell_id')
      .where('cells.endpoint', endpoint)
      .andWhere('projects.is_approved', true)
      .andWhere('projects.is_complete', isComplete);
  }

  async getProposedByCellEndpoint(endpoint: string) {
    return this.qb
      .select()
      .join('cells', 'cells.id', 'projects.cell_id')
      .where('cells.endpoint', endpoint);
  }

  async getProposedByUser(userId: number) {
    return this.qb
      .select()
      .join('cells', 'cells.id', 'projects.cell_id')
      .where('projects.proposed_by', userId);
  }
}
