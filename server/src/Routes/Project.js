import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello!');
});

router.get('/:projectId', async (req, res, next) => {
  try {
    const data = await db.select('*').from('project').where('id', req.params.projectId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId} ERROR: ${e}`);
    next(e);
  }
});

router.get('/:projectId/team', async (req, res, next) => {
  try {
    const data = await db
      .select('users.*')
      .from('project')
      .join('project_users', 'project.id', 'project_users.project_id')
      .join('users', 'users.id', 'project_users.project_id')
      .where('project.id', req.params.projectId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/team ERROR: ${e}`);
    next(e);
  }
});

router.get('/:projectId/tags', async (req, res, next) => {
  try {
    const data = await db
      .select('tag.*')
      .from('project')
      .join('project_tag', 'project.id', 'project_tag.project_id')
      .join('tag', 'tag.id', 'project_tag.tag_id')
      .where('project.id', req.params.projectId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/tags ERROR: ${e}`);
    next(e);
  }
});

router.get('/:projectId/photos', async (req, res, next) => {
  try {
    const data = await db.select('*').from('project_photo').where('project_id', req.params.projectId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/photos ERROR: ${e}`);
    next(e);
  }
});

export default router;
