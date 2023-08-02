import express from 'express';
import multer from 'multer';
import db from '../db.js';
import { findUserById, getUserRoles } from '../Services/LoginService.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ahoy!');
});

// eslint-disable-next-line consistent-return
router.get('/:cellId/all', async (req, res, next) => {
  try {
    const cellData = await db.select('*').from('cell').where('cell_endpoint', req.params.cellId);

    const teamData = await db('users')
      .select('users.*')
      .join('cell', 'users.cell_id', '=', 'cell.base_id')
      .where('cell.cell_endpoint', req.params.cellId);

    const currentProjectData = await db('project')
      .select('project.*')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('project.is_approved', true)
      .andWhere('project.is_complete', false);
    const previousProjectData = await db
      .select('project.*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('project.is_approved', true)
      .andWhere('project.is_complete', true);
    const baseData = await db('base').select().where('id', cellData[0].id).first();

    const data = { ...cellData[0], team: teamData, current_projects: currentProjectData, previous_projects: previousProjectData, baseData };

    if (data.length === 0) {
      return res.status(404).json({ message: 'Cell not found' });
    }

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/all ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellId', async (req, res, next) => {
  try {
    const data = await db('cell').first().where('cell_endpoint', req.params.cellId).orWhere('id', req.params.cellId);

    if (!data) {
      return res.status(404).json({ message: 'Cell not found' });
    }
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId} ERROR: ${e}`);
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

    const user = await findUserById(req.session.user);
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
      const { id, baseId, cellName, cellEndpoint, externalWebsite, cellMission, contactNumber1, contactNumber2, email } = req.body;
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
      .select('*')
      .from('users')
      .join('cell', 'users.cell_id', '=', 'cell.base_id')
      .where('cell.cell_endpoint', req.params.cellId);

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

    const user = await findUserById(req.session.user);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    return next();
  },
  async (req, res, next) => {
    try {
      const userRoles = await getUserRoles(req.session.user);
      const whereCondition = { 'cell.id': req.params.cellId };

      if (userRoles === req.session.roles) {
        if (userRoles !== 'cell' && userRoles !== 'site') {
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
    const cell = await db('cell').select('id').where('cell_endpoint', req.params.cellEndpoint).first();
    const data = await db('news_feed').select().where('cell_id', cell.id);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

export default router;
