import { Cell } from '../types';
import { Repository } from './Repository';

export class LocationRepository extends Repository {
  async getAll(): Promise<Cell[]> {
    return this.db.select();
  }
}
