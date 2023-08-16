import { NextFunction, Request, Response } from 'express';
import { Base, Cell, Components } from '../types';
import { ProjectStatus } from '../Repository/ProjectRepository.js';

// eslint-disable-next-line func-names
export default function (components: Components) {
  const { cellRepository } = components;

  return {
    async addCell(req: Request, res: Response, next: NextFunction) {
      try {
        const cellData = req.body;
        // const insertedIds = await db('cell').insert(cellData, ['*']);
        const newCells = await cellRepository.addCell(cellData);

        res.status(200).json({ message: 'Cell registered successfully!', newCells: newCells[0] });
      } catch (e) {
        console.error(`POST /cell_list ERROR: ${e}`);
        next(e);
      }
    },
    async deleteCell(req: Request, res: Response, next: NextFunction) {
      try {
        const cellId = parseInt(req.params.cellId, 10);

        const deletedCount = await cellRepository.deleteById(cellId);

        if (deletedCount > 0) {
          res.status(200).json({ message: 'Cell deleted successfully!' });
        } else {
          res.status(404).json({ message: 'Cell not found.' });
        }
      } catch (e) {
        console.error(`DELETE /cell_list/:id ERROR: ${e}`);
        next(e);
      }
    },
    async patchCell(req: Request, res: Response, next: NextFunction) {
      try {
        if (req.params.cellId !== req.body.id) {
          return res.status(400).send({ msg: 'Wrong cell id found' });
        }

        const updated = await cellRepository.updateCell(req.body);

        return res.status(200).json(updated);
      } catch (e) {
        console.error(`GET /cell/${req.params.cellId} ERROR: ${e}`);
        return next(e);
      }
    },
    async approveCell(req: Request, res: Response, next: NextFunction) {
      try {
        const cellId = parseInt(req.params.cellId, 10);
        // const updates = req.body;

        // const updatedCount = await db('cell')
        //   .where({ id: cellId, is_approved: 'no' })
        //   .update({ ...updates, is_approved: 'yes' });

        const updated = await cellRepository.approveCell(cellId);

        if (updated > 0) {
          res.status(200).json({ message: 'Cell approved successfully!' });
        } else {
          res.status(404).json({ message: 'Cell not found or already approved.' });
        }
      } catch (e) {
        console.error(`PATCH /approve_cell/:id ERROR: ${e}`);
        next(e);
      }
    },
    async getCells(req: Request, res: Response, next: NextFunction) {
      try {
        let data: (Cell[] & Base[]) | Cell[] | undefined;
        if (req.query.include && typeof req.query.include === 'string') {
          const includeQueries = req.query.include.split('+');
          if (includeQueries.includes('bases')) {
            console.log('getting bases');
            data = await cellRepository.getAllWithBases();
          }
        } else {
          console.log('no includes');
          data = await cellRepository.getAll();
        }
        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /cell/list ERROR: ${e}`);
        next(e);
      }
    },
    async getCell(req: Request, res: Response, next: NextFunction) {
      try {
        if (req.params.cellEndpoint) {
          const endpoint = req.params.cellEndpoint;

          const {
            cell,
            team,
            currentProjects,
            previousProjects,
            base: baseData,
          } = await cellRepository.getDetailsByEndpoint(endpoint);

          const data = {
            cell,
            team,
            currentProjects,
            previousProjects,
            baseData,
          };

          res.status(200).json(data);
        }
      } catch (e) {
        console.error(`GET /cell/${req.params.cellEndpoint} ERROR: ${e}`);
        next(e);
      }
    },

    async getCellTeam(req: Request, res: Response, next: NextFunction) {
      try {
        const data = await cellRepository.getTeamByEndpoint(req.params.cellEndpoint);

        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /cell/${req.params.cellEndpoint}/team ERROR: ${e}`);
        next(e);
      }
    },

    async getCellProjects(req: Request, res: Response, next: NextFunction) {
      try {
        if (typeof req.query.type !== 'string') {
          throw new Error('type is not a string');
        }
        let status;
        switch (req.query.type) {
          case 'complete':
            status = ProjectStatus.Completed;
            break;
          case 'current':
            status = ProjectStatus.Current;
            break;
          case 'proposed':
            status = ProjectStatus.Pending;
            break;
          default:
            break;
        }

        if (!status) {
          throw new Error('type is not valid');
        }
        // const data = await projectRepository.getCompleteByCellEndpoint(req.params.cellEndpoint);
        const data = await cellRepository.getProjectsByStatus(req.params.cellEndpoint, status);

        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /cell/${req.params.cellEndpoint}/previous_projects ERROR: ${e}`);
        next(e);
      }
    },

    async getCellNews(req: Request, res: Response, next: NextFunction) {
      try {
        const data = await cellRepository.getNews(req.params.cellEndpoint);

        res.status(200).json(data);
      } catch (e) {
        console.error(`GET /cell/${req.params.cellEndpoint}/previous_projects ERROR: ${e}`);
        next(e);
      }
    },
  };
}
