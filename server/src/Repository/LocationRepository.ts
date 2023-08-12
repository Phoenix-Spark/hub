import { Cell } from '../types';
import { Repository } from './Repository.js';

export class LocationRepository extends Repository {
  async getAll(): Promise<Cell[]> {
    return this.qb.select();
  }

  async getByCellId(cellId: number | string) {
    if (typeof cellId === 'string') {
      cellId = parseInt(cellId, 10);
    }

    return this.qb.first().where('id', cellId);
  }
}
