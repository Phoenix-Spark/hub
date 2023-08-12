import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import {
  addUser,
  doesUserExist,
  findUserById,
  generateUserToken,
  getBaseAndCell,
  loginUser,
  validateLogin,
} from '../Services/LoginService.js';
import db from '../db.js';
import { User } from '../types';
import { userRepository } from '../app.js';

const router = express.Router();

// eslint-disable-next-line consistent-return
export async function signUpHandler(req: Request, res: Response) {
  if (req.session.user) {
    return res.status(200).json({ message: 'You are already logged in. Did you mean to do that?' });
  }

  if (!req.body.username || !req.body.password) {
    throw new Error('missing required arguments');
  }
  // does the user exist?
  const userDoesNotExist = !(await doesUserExist(req.body.username));

  try {
    // User does not exist keep going
    if (userDoesNotExist) {
      // eslint-disable-next-line
      for (const item in req.body) {
        req.body[item] = encodeURIComponent(req.body[item]);
      }

      const user = await addUser(req.body, req.file ?? { filename: '' });

      const result = await loginUser(user);
      if (result) {
        const { token, roles } = result;

        req.session.regenerate((regenErr: string) => {
          if (regenErr) throw new Error(regenErr);

          try {
            // eslint-disable-next-line no-param-reassign
            req.session.roles = roles;
            // eslint-disable-next-line no-param-reassign
            if (user) {
              delete user.password;
              req.session.user = user;
            }

            req.session.save((saveErr: string) => {
              if (saveErr) throw new Error(saveErr);
              return res.status(200).json({ token });
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            throw new Error(e);
          }
        });
      }
    } else {
      return res.status(401).json('User already exists');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('There was an error. ', e);
    return res.status(500).send({ error: e.message });
  }
}

// eslint-disable-next-line consistent-return
export async function loginHandler(req: Request, res: Response) {
  if (req.session.user) {
    return res.status(200).json({ message: 'You are already logged in.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json('Username and password required');
  }

  const validUser = await validateLogin(username, password);
  if (validUser === undefined) {
    return res.status(401).json('Incorrect username or password');
  }
  try {
    const result = await loginUser(validUser);
    if (result) {
      const { token, roles } = result;
      req.session.regenerate((regenErr: string) => {
        if (regenErr) throw new Error(regenErr);

        try {
          // eslint-disable-next-line no-param-reassign
          req.session.roles = roles;
          // eslint-disable-next-line no-param-reassign
          req.session.user = validUser;

          req.session.save((saveErr: string) => {
            if (saveErr) throw new Error(saveErr);
            return res.status(200).json({ token });
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          throw new Error(e);
        }
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return res.status(500).send({ error: e.message });
  }
}

export async function logoutHandler(req: Request, res: Response) {
  req.session.user = null;
  req.session.save((saveErr: string) => {
    if (saveErr) throw new Error(saveErr);

    req.session.regenerate((regenErr: string) => {
      if (regenErr) throw new Error(regenErr);
      res.status(200).json({ message: 'logout complete' });
    });
  });
}

router.get('/:userId/profile', async (req, res, next) => {
  try {
    const idIsNumber = !Number.isNaN(parseInt(req.params.userId, 10));
    const userId = idIsNumber ? parseInt(req.params.userId, 10) : req.params.userId;

    let data;
    if (idIsNumber && typeof userId === 'number') {
      data = await userRepository.findById(userId);
    } else if (typeof userId === 'string') {
      data = await userRepository.findByUsername(userId);
    } else {
      throw new Error('userId is incorrect type');
    }
    res.status(200).json(data);
  } catch (e) {
    console.error(`GET /user/${req.params.userId}/profile ERROR: ${e}`);
    next(e);
  }
});

router.get('/:userId/projects', async (req, res, next) => {
  try {
    // const user = await db('users').select('id').where('id', req.params.userId).first();
    // const projects = await db('project')
    //   .select()
    //   .where('proposed_by', req.params.userId)
    //   .orderByRaw('is_approved NULLS FIRST');

    const userId = parseInt(req.params.userId, 10);

    const projects = await userRepository.getProjectsById(userId);

    res.status(200).json(projects);
  } catch (e) {
    console.error(`Error was caught ${e}`);
    next(e);
  }
});

/** Use this example to protect routes that require auth */
/** After this middleware the user roles can be accessed from req.session.roles */
/** And the user can be accessed from req.user */
const handleAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  let user = null;
  if (req.session.user.id) {
    user = await findUserById(req.session.user.id);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
  }

  return next();
};

router.use(handleAuth);

router.get('/test', async (req, res) => {
  let firstName = '';
  if (req.user) {
    ({ firstName } = req.user);
  }
  res.status(200).json({ message: `Welcome, ${firstName}!` });
});

// Used when the client first loads without any user details but a valid server session exists
router.get('/refresh', async (req, res, next) => {
  if (req.user) {
    const { token } = await generateUserToken(req.user);
    return res.status(200).json({ token });
  }
  return next();
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_PATH || '/tmp/uploads/';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileType = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
    cb(null, `profile-${uniqueSuffix}${fileType}`);
  },
});
const profileUpload = multer({ dest: 'uploads/', storage: profileStorage });
/**
 *
app.post('/signup', profileUpload.single('photo'), signUpHandler);
 *
 *
 */

router.patch('/update', profileUpload.single('photo'), async (req, res, next) => {
  const data: User = req.body;
  console.log('req.body = ', req.body);
  try {
    let photoUrl;
    if (!req.file) {
      ({ photo_url: photoUrl } = await db('users')
        .first('photo_url')
        .where('username', data.username));
    }

    const [update] = await db
      .first()
      .from('users')
      .where('username', data.username)
      .update({
        base_id: data.baseId,
        cell_id: data.cellId,
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        photo_url: req.file?.path ?? photoUrl,
        contact_number1: data.contactNumbers[0],
        contact_number2: data.contactNumbers[1],
        bio: data.bio,
      })
      .returning('*');

    console.log('update', update);

    const { base, cell } = await getBaseAndCell(update.base_id, update.cell_id);
    const updatedUser: User = {
      username: update.username,
      firstName: update.first_name,
      lastName: update.last_name,
      email: update.email,
      baseId: update.base_id,
      cellId: update.cell_id,
      photo: update.photo_url,
      contactNumbers: [update.contact_number1, update.contact_number2],
      bio: update.bio,
      base,
      cell,
      id: update.id,
    };

    if (!update) {
      res.status(404).json({ message: 'User not found' });
    } else {
      console.log(`PATCH /user/update/  User Id:${data.username}`);
      const { token } = await generateUserToken(updatedUser);
      return res.status(200).json({ token });
    }
  } catch (err) {
    console.log(`PATCH /user/update/   User: ${data.username} ERROR: ${err}`);
    return res.status(500).json({ message: err });
  }

  return next();
});

export default router;
