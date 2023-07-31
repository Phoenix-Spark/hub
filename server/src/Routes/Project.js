import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello!');
});

router.get('/:projectId/all', async (req, res, next) => {
  try {
    const projectData = await db.select('*').from('project').where('id', req.params.projectId);
    const teamData = await db
      .select('users.*')
      .from('project')
      .join('project_users', 'project.id', 'project_users.project_id')
      .join('users', 'users.id', 'project_users.users_id')
      .where('project.id', req.params.projectId);
    const tagsData = await db
      .select('tag.*')
      .from('project')
      .join('project_tag', 'project.id', 'project_tag.project_id')
      .join('tag', 'tag.id', 'project_tag.tag_id')
      .where('project.id', req.params.projectId);
    const photoData = await db.select('*').from('project_photo').where('project_id', req.params.projectId);

    const data = { ...projectData[0], team: teamData, tags: tagsData, photos: photoData };

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/all ERROR: ${e}`);
    next(e);
  }
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
      .join('users', 'users.id', 'project_users.users_id')
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

router.post('/:projectId/approve', async (req, res, next) => {
  try {
    //    table.boolean('is_approved');
    //     table.date('date_approved');
    const approved = await db('project')
      .where('id', req.params.projectId)
      .update({ is_approved: true, date_approved: db.fn.now() }, ['id']);
    console.log(approved);
    if (approved.length > 0) {
      res.status(200).json(approved[0]);
    } else {
      throw new Error('There was an error.');
    }
  } catch (e) {
    console.error(`Caught an exception. ${e}`);
  }
});
router.post('/:projectId/deny', async (req, res, next) => {
  try {
    //    table.boolean('is_approved');
    //     table.date('date_approved');
    const denied = await db('project').where('id', req.params.projectId).update({ is_approved: false, date_approved: db.fn.now() }, ['id']);

    if (denied.length > 0) {
      res.status(200).json(denied[0]);
    } else {
      throw new Error('There was an error.');
    }
  } catch (e) {
    console.error(`Caught an exception. ${e}`);
  }
});

export default router;
