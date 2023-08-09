import { Base, Cell } from '../types';
import { Repository } from './Repository';

export class CellRepository extends Repository {
  async getAll(): Promise<Cell[]> {
    return this.db.select();
  }

  async getAllWithBases(): Promise<Cell[] & Base[]> {
    return this.getAllWithJoin('bases', 'bases.id', 'cells.id').whereNot('is_approved', 'no');
  }

  async findById(id: number): Promise<Cell> {
    return this.db.first().where('id', id);
  }

  async findByEndpoint(endpoint: string): Promise<Cell> {
    return this.db.first().where('endpoint', endpoint);
  }
}
