import type { NewsStory } from '../types';
import { Repository } from './Repository';

export class NewsRepository extends Repository {
  async getAll(): Promise<NewsStory[]> {
    return this.qb.select();
  }

  async getAllByCellId(cellId: number | string) {
    if (typeof cellId === 'string') {
      cellId = parseInt(cellId, 10);
    }

    return this.qb.select().where('id', cellId);
  }
  async getAllByCellEndpoint(endpoint: string) {
    return this.qb
      .select('news.id', 'news.cell_id as cellId', 'news.title', 'news.date')
      .join('cells', 'news.cell_id', 'cells.id')
      .where('cells.endpoint', endpoint);
  }
}
