import { Base } from '../types';
import { Repository } from './Repository.js';
import { IBaseRepository } from '../types/IRepository.js';

export class LocationRepository extends Repository<Base> implements IBaseRepository {
  async getAll(): Promise<Base[]> {
    return this.qb.select();
  }

  async getByCellId(cellId: number | string) {
    if (typeof cellId === 'string') {
      cellId = parseInt(cellId, 10);
    }

    return this.qb.first().where('id', cellId);
  }
}
