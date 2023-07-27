import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ahoy!');
});

router.get('/:cellId', async (req, res, next) => {
  try {
    const data = await db.select('*').from('cell').where('cell_endpoint', req.params.cellId);

    if (data.length === 0) {
      // return res.redirect('/');
      return res.status(404).json({ message: 'Cell not found' });
    }

    res.status(200).json(data);
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

router.get('/:cellId/proposed_projects', async (req, res, next) => {
  try {
    const data = await db
      .select('*')
      .from('project')
      .join('cell', 'cell.id', 'project.cell_id')
      .where('cell.cell_endpoint', req.params.cellId)
      .andWhere('is_approved', false);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /cell/${req.params.cellId}/proposed_projects ERROR: ${e}`);
    next(e);
  }
});

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
