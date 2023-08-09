import express, { Request } from 'express';
import multer from 'multer';
import db from '../db';
import { findUserById, getUserRoles } from '../Services/LoginService';
import { Base, Cell, User } from '../types';
import { CellRepository } from '../Repository/CellRepository';
import { UserRepository } from '../Repository/UserRepository';

const router = express.Router();
const cellRepository = new CellRepository(db('cells'));
const userRepository = new UserRepository(db('users'));

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
router.get('/:cellEndpoint/all', async (req, res, next) => {
  try {
    if (req.params.cellEndpoint) {
      const endpoint = req.params.cellEndpoint;

      const cellData = await cellRepository.findByEndpoint(endpoint);

      if (!cellData) {
        throw new Error('Cell not found');
      }

      const teamData = await userRepository.getByCellEndpoint(endpoint);
      // const teamData = await db('users')
      //   .select('users.*')
      //   .join('cells', 'users.cell_id', '=', 'cells.id')
      //   .where('cells.endpoint', endpoint);

      const currentProjectData = await db('projects')
        .select('projects.*')
        .join('cells', 'cells.id', 'projects.cell_id')
        .where('cells.endpoint', endpoint)
        .andWhere('projects.is_approved', true)
        .andWhere('projects.is_complete', false);

      const previousProjectData = await db
        .select('projects.*')
        .from('projects')
        .join('cells', 'cells.id', 'projects.cell_id')
        .where('cells.endpoint', endpoint)
        .andWhere('projects.is_approved', true)
        .andWhere('projects.is_complete', true);

      const baseData = await db('bases').select().where('id', cellData.id).first();

      const data = {
        ...cellData,
        team: teamData,
        current_projects: currentProjectData,
        previous_projects: previousProjectData,
        baseData,
      };

      res.status(200).json(data);
    }
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/all ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellId', async (req, res, next) => {
  try {
    const data = await db('cell')
      .first()
      .where('cell_endpoint', req.params.cellId)
      .orWhere('id', req.params.cellId);

    if (!data) {
      return res.status(404).json({ message: 'Cell not found' });
    }
    return res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId} ERROR: ${e}`);
    return next(e);
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

router.get('/:cellId/team', async (req, res, next) => {
  try {
    const data = await db
      .select(
        'users.id',
        'users.username',
        'users.first_name as firstName',
        'users.last_name as lastName',
        'users.email',
        'users.photo_url as photo',
        'users.contact_number1 as contactNumber1',
        'users.contact_number2 as contactNumber2',
        'users.bio'
      )
      .from('users')
      .join('cell', 'users.cell_id', '=', 'cell.base_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .orWhere('cell.id', req.params.cellId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/team ERROR: ${e}`);
    next(e);
  }
});

router.get(
  '/:cellId/proposed_projects',
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
  async (req, res, next) => {
    try {
      const userRoles = await getUserRoles(req.session.user!.id!);
      const whereCondition: { 'cell.id': string; 'project.proposed_by'?: User | undefined | null } =
        { 'cell.id': req.params.cellId };

      if (userRoles === req.session.roles) {
        if (userRoles[0].roles !== 'cell' && userRoles[0].roles !== 'site') {
          whereCondition['project.proposed_by'] = req.session.user;
        }
      }
      const data = await db
        .select(
          'project.*',
          'users.id as user_id',
          'users.username as user_name',
          'users.first_name as user_first_name',
          'users.last_name as user_last_name',
          'users.photo_url as user_photo'
        )
        .from('project')
        .join('cell', 'cell.id', 'project.cell_id')
        .join('users', 'users.id', 'project.proposed_by')
        .where(whereCondition)
        .andWhere('project.is_approved', null)
        .orderBy('project.date_proposed');

      res.status(200).json(data ?? {});
    } catch (e) {
      console.error(`GET /cell/${req.params.cellId}/proposed_projects ERROR: ${e}`);
      next(e);
    }
  }
);

router.get('/:cellId/current_projects', async (req, res, next) => {
  try {
    const data = await db
      .select('*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('is_approved', true)
      .andWhere('is_complete', false)
      .orderBy('date_approved');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/current_projects ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellId/previous_projects', async (req, res, next) => {
  try {
    const data = await db
      .select('*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('is_approved', true)
      .andWhere('is_complete', true)
      .orderBy('date_complete');

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellEndpoint/news', async (req, res, next) => {
  try {
    const cell = await db('cell')
      .select('id')
      .where('cell_endpoint', req.params.cellEndpoint)
      .first();
    const data = await db('news_feed').select().where('cell_id', cell.id);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellEndpoint}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

export default router;
