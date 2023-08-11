import express, { Request } from 'express';
import multer from 'multer';
import db from '../db';
import { findUserById } from '../Services/LoginService';
import { Base, Cell } from '../types';
import { cellRepository } from '../app';
import { ProjectStatus } from '../Repository/CellRepository';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ahoy!');
});

router.get(
  '/list',
  async (
    req: Request<never, (Cell[] & Base[]) | Cell[] | undefined, never, { include: string }>,
    res,
    next
  ) => {
    try {
      console.log(req.query.include);
      let data: (Cell[] & Base[]) | Cell[] | undefined;
      if (req.query.include) {
        const includeQueries = req.query.include.split('+');
        if (includeQueries.includes('base')) {
          data = await cellRepository.getAllWithBases();
        }
      } else {
        data = await cellRepository.getAll();
      }
      res.status(200).json(data);
    } catch (e) {
      console.error(`GET /cell/list ERROR: ${e}`);
      next(e);
    }
  }
);

// eslint-disable-next-line consistent-return
router.get('/:cellEndpoint', async (req, res, next) => {
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
});

const cellUpload = multer();

router.patch(
  '/:cellId',
  async (req, res, next) => {
    if (!req.session.user) {
      return res.sendStatus(401);
    }

    const user = await findUserById(req.session.user.id!);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    return next();
  },
  cellUpload.none(),
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      /* TODO: Move DB Update to Repository */
      const {
        id,
        baseId,
        cellName,
        cellEndpoint,
        externalWebsite,
        cellMission,
        contactNumber1,
        contactNumber2,
        email,
      } = req.body;
      if (req.params.cellId !== id) {
        return res.status(400).send({ msg: 'Wrong cell id found' });
      }
      const updated = await db('cell').first().where('id', id).update(
        {
          base_id: baseId,
          cell_name: cellName,
          cell_endpoint: cellEndpoint,
          external_website: externalWebsite,
          cell_mission: cellMission,
          contact_number1: contactNumber1,
          contact_number2: contactNumber2,
          email,
        },
        ['*']
      );

      res.status(200).json(updated[0]);
    } catch (e) {
      console.error(`GET /cell/${req.params.cellId} ERROR: ${e}`);
      next(e);
    }
  }
);

router.get('/:cellEndpoint/team', async (req, res, next) => {
  try {
    const data = await cellRepository.getTeamByEndpoint(req.params.cellEndpoint);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/team ERROR: ${e}`);
    next(e);
  }
});

/*
 * GET route to show all proposed projects for the cell
 * For user proposed projects look in the User router
 */
router.get(
  '/:cellEndpoint/proposed-projects',
  async (req, res, next) =>
    // if (!req.session.user) {
    //   return res.sendStatus(401);
    // }
    //
    // const user = await findUserById(req.session.user.id!);
    // if (!user) {
    //   return res.sendStatus(401);
    // }
    // req.user = user;
    next(),
  async (req, res, next) => {
    try {
      // const data = await projectRepository.getProposedByCellEndpoint(req.params.cellEndpoint);
      const data = await cellRepository.getProjectsByStatus(
        req.params.cellEndpoint,
        ProjectStatus.Pending
      );
      res.status(200).json(data ?? {});
    } catch (e) {
      console.error(`GET /cell/${req.params.cellEndpoint}/proposed_projects ERROR: ${e}`);
      next(e);
    }
  }
);

router.get('/:cellEndpoint/current-projects', async (req, res, next) => {
  try {
    // const data = await projectRepository.getCurrentByCellEndpoint(req.params.cellEndpoint);
    const data = await cellRepository.getProjectsByStatus(
      req.params.cellEndpoint,
      ProjectStatus.Current
    );

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/current_projects ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellEndpoint/complete-projects', async (req, res, next) => {
  try {
    // const data = await projectRepository.getCompleteByCellEndpoint(req.params.cellEndpoint);
    const data = await cellRepository.getProjectsByStatus(
      req.params.cellEndpoint,
      ProjectStatus.Completed
    );

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellEndpoint/news', async (req, res, next) => {
  try {
    const data = await cellRepository.getNews(req.params.cellEndpoint);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

export default router;
