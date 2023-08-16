import { NextFunction, Request, Response } from 'express';
import { Components } from '../types';

// eslint-disable-next-line func-names
export default function (components: Components) {
  const { newsRepository } = components;

  return {
    async getAllNews(req: Request, res: Response, next: NextFunction) {
      try {
        const data = await newsRepository.getAll();
        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /news ERROR: ${e}`);
        next(e);
      }
    },
  };
}
