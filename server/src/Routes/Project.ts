import express from 'express';
import multer from 'multer';
import db from '../Database/index.js';
import { User } from '../types';
import { projectRepository, userRepository } from '../app.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello!');
});

router.get('/:projectId', async (req, res, next) => {
  try {
    const {
      project,
      users: team,
      tags,
      photos,
    } = await projectRepository.getAllProjectDetailsById(req.params.projectId);

    res.status(200).json({ project, team, tags, photos });
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/all ERROR: ${e}`);
    next(e);
  }
});

// const projectStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = process.env.UPLOAD_PATH || '/tmp/uploads/projects';
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const fileType = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
//     cb(null, `project-${uniqueSuffix}${fileType}`);
//   },
// });
//
const projectUpload = multer();

/* TODO: Move POST, DELETE, PATCH request DB calls to the Repository */
router.post(
  '/add',
  async (req, res, next) => {
    if (!req.session.user) {
      return res.sendStatus(401);
    }

    // const user = await findUserById(req.session.user.id ?? 0);
    const user = await userRepository.findById(req.session.user.id!);

    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    return next();
  },
  projectUpload.none(),
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { cellId, name, description, budget, proposedByUsername } = req.body;

      // const result = await findUser(proposedByUsername);

      const result = await userRepository.getUserId(proposedByUsername);

      if (result.user) {
        console.log(result.user.id);
        const inserted = await db('project').insert(
          {
            cell_id: cellId,
            name,
            description,
            budget,
            proposed_by: result.id,
            date_proposed: db.fn.now(),
            is_complete: false,
          },
          ['*']
        );

        const newTeam = await db('project_users').insert(
          {
            project_id: inserted[0].id,
            users_id: result.id,
          },
          ['*']
        );

        const newProject = { team: newTeam[0], project: inserted[0] };

        res.status(200).json(newProject);
      }
      // eslint-disable-next-line
    } catch (e: any) {
      console.error(`GET /projects/add ERROR: ${e}`);
      next(e);
    }
  }
);

router.patch(
  '/:projectId',
  async (req, res, next) => {
    if (!req.session.user && !req.session.user!.id) {
      return res.sendStatus(401);
    }

    const user = await userRepository.findById(req.session.user!.id!); // The bangs tell typescript that we know this is not null
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    return next();
  },
  projectUpload.none(),
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { name, description, budget } = req.body;

      const updated = await db('project').first().where('id', req.params.projectId).update(
        {
          name,
          description,
          budget,
        },
        ['*']
      );

      res.status(200).json(updated);
    } catch (e) {
      console.error(`PATCH /projects/${req.params.projectId} ERROR: ${e}`);
      next(e);
    }
  }
);

router.get('/:projectId/team', async (req, res, next) => {
  try {
    const data = await projectRepository.getProjectUsersById(req.params.projectId);

    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/team ERROR: ${e}`);
    next(e);
  }
});

const teamUpload = multer();

router.post('/:projectId/team/add', teamUpload.none(), async (req, res, next) => {
  try {
    let newMembers = [];
    const { member: newMemberIds, projectId } = req.body;

    if (Array.isArray(newMemberIds)) {
      const promises: Promise<User | undefined>[] = [];

      newMemberIds.forEach(async id => {
        promises.push(userRepository.findById(parseInt(id, 10)));
      });
      const result = await Promise.all(promises);

      newMembers = [...result];
    } else {
      newMembers.push(await userRepository.findById(parseInt(newMemberIds, 10)));
    }

    const dbPromises: Promise<Array<object>>[] = [];
    newMembers.forEach(member => {
      if (member) {
        dbPromises.push(
          db('project_users').insert(
            {
              project_id: projectId,
              users_id: member.id,
            },
            ['*']
          )
        );
      }
    });

    const dbResult = await Promise.all(dbPromises);

    res.status(200).json({ dbResult });
  } catch (e) {
    console.error(`POST /projects/${req.params.projectId}/team/add ERROR: ${e}`);
    next(e);
  }
});

router.delete('/:projectId/team/remove', teamUpload.none(), async (req, res, next) => {
  try {
    let membersToRemove = [];
    const { member: memberIds, projectId } = req.body;

    if (Array.isArray(memberIds)) {
      const promises: Promise<User | undefined>[] = [];

      memberIds.forEach(async id => {
        promises.push(userRepository.findById(parseInt(id, 10)));
      });
      const result = await Promise.all(promises);

      membersToRemove = [...result];
    } else {
      membersToRemove.push(await userRepository.findById(parseInt(memberIds, 10)));
    }

    const dbPromises: Promise<Array<object>>[] = [];
    membersToRemove.forEach(member => {
      if (member) {
        dbPromises.push(
          db('project_users')
            .select()
            .where('project_id', projectId)
            .andWhere('users_id', member.id)
            .delete()
        );
      }
    });

    const dbResult = await Promise.all(dbPromises);

    console.log(dbResult);

    res.status(200).json({ dbResult });
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/tags ERROR: ${e}`);
    next(e);
  }
});

router.get('/:projectId/tags', async (req, res, next) => {
  try {
    const data = await projectRepository.getProjectTagsById(req.params.projectId);
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /projects/${req.params.projectId}/tags ERROR: ${e}`);
    next(e);
  }
});

router.get('/:projectId/photos', async (req, res, next) => {
  try {
    const data = await projectRepository.getProjectPhotosById(req.params.projectId);

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
    next(e);
  }
});
router.post('/:projectId/deny', async (req, res, next) => {
  try {
    //    table.boolean('is_approved');
    //     table.date('date_approved');
    console.log('deny', req.body);
    const denied = await db('project')
      .where('id', req.params.projectId)
      .update({ is_approved: false, date_approved: db.fn.now(), comments: req.body?.comment }, [
        'id',
      ]);

    if (denied.length > 0) {
      res.status(200).json(denied[0]);
    } else {
      throw new Error('There was an error.');
    }
  } catch (e) {
    console.error(`Caught an exception. ${e}`);
    next(e);
  }
});

export default router;
