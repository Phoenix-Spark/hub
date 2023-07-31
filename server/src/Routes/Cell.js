import express from 'express';
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
    const teamData = await db
      .select('users.*')
      .from('users')
      .join('cell', 'users.cell_id', '=', 'cell.base_id')
      .where('cell.cell_endpoint', req.params.cellId);
    const currentProjectData = await db
      .select('*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('is_approved', true)
      .andWhere('is_complete', false);
    const previousProjectData = await db
      .select('*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('is_approved', true)
      .andWhere('is_complete', true);

    const data = {...cellData[0], team: teamData, current_projects: currentProjectData, previous_projects: previousProjectData};

    if (data.length === 0) {
      return res.status(404).json({ message: 'Cell not found' });
    }

    res.status(200).json(data);
    console.log('Raw get data:', data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/all ERROR: ${e}`);
    next(e);
  }
});

router.get('/:cellId', async (req, res, next) => {
  try {
    const data = await db.select('*').from('cell').where('cell_endpoint', req.params.cellId);
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Cell not found' });
    }

    res.status(200).json(data);
    console.log('Raw get data:', data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId} ERROR: ${e}`);
    next(e);
  }
});

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
      console.log(whereCondition);
      const data = await db
        .select('*')
        .from('project')
        .join('cell', 'cell.id', 'project.cell_id')
        .where(whereCondition)
        .andWhere('is_approved', false);
      console.log(data);
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
      .andWhere('is_complete', false);

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
      .andWhere('is_complete', true);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/previous_projects ERROR: ${e}`);
    next(e);
  }
});

export default router;
