import express from 'express';
import multer from 'multer';
import {
  addUser,
  doesUserExist,
  findUserById,
  generateUserToken,
  getBaseAndCell,
  loginUser,
  User,
  validateLogin,
} from '../Services/LoginService.js';
import db from '../db.js';

const router = express.Router();

// eslint-disable-next-line consistent-return
export async function signUpHandler(req, res) {
  if (req.session.user) {
    return res.status(200).json({ message: 'You are already logged in. Did you mean to do that?' });
  }

  if (!req.body.username || !req.body.password) {
    throw new Error('missing required arguments');
  }
  // does the user exist?
  const userDoesNotExist = (await doesUserExist(req.body.username)) === false;

  try {
    // User does not exist keep going
    if (userDoesNotExist) {
      // eslint-disable-next-line
      for (const item in req.body) {
        req.body[item] = encodeURIComponent(req.body[item]);
      }

      const user = await addUser(req.body, req.file ?? { filename: '' });

      const { token, roles } = await loginUser(user, req.session);

      req.session.regenerate(regenErr => {
        if (regenErr) throw new Error(regenErr);

        try {
          // eslint-disable-next-line no-param-reassign
          req.session.roles = roles;
          // eslint-disable-next-line no-param-reassign
          req.session.user = user.id;

          req.session.save(saveErr => {
            if (saveErr) throw new Error(saveErr);
            return res.status(200).json({ token });
          });
        } catch (e) {
          throw new Error(e);
        }
      });
    } else {
      return res.status(401).json('User already exists');
    }
  } catch (e) {
    console.error('There was an error. ', e);
    return res.status(500).send({ error: e.message });
  }
}

// eslint-disable-next-line consistent-return
export async function loginHandler(req, res) {
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
    const { token, roles } = await loginUser(validUser, req.session);
    req.session.regenerate(regenErr => {
      if (regenErr) throw new Error(regenErr);

      try {
        // eslint-disable-next-line no-param-reassign
        req.session.roles = roles;
        // eslint-disable-next-line no-param-reassign
        req.session.user = validUser.id;

        req.session.save(saveErr => {
          if (saveErr) throw new Error(saveErr);
          return res.status(200).json({ token });
        });
      } catch (e) {
        throw new Error(e);
      }
    });
  } catch (e) {
    return res.status(500).send({ error: e.message });
  }
}

export async function logoutHandler(req, res) {
  req.session.user = null;
  req.session.save(saveErr => {
    if (saveErr) throw new Error(saveErr);

    req.session.regenerate(regenErr => {
      if (regenErr) throw new Error(regenErr);
      res.status(200).json({ message: 'logout complete' });
    });
  });
}

router.get('/:userName/projects(/:filter)?', async (req, res, next) => {
  try {
    const user = await db('users').select('id').where('first_name', req.params.userName).first();
    const projects = await db('project').select().where('proposed_by', user.id).orderByRaw('is_approved NULLS FIRST');

    res.status(200).json(projects);
  } catch (e) {
    console.error(`Error was caught ${e}`);
  }
});

/** Use this example to protect routes that require auth */
/** After this middleware the user roles can be accessed from req.session.roles */
/** And the user can be accessed from req.user */
router.use(async (req, res, next) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const user = await findUserById(req.session.user);
  if (!user) {
    return res.sendStatus(401);
  }
  req.user = user;
  return next();
});

router.get('/test', async (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.firstName}!` });
});

// Used when the client first loads without any user details but a valid server session exists
router.get('/refresh', async (req, res) => {
  // const user = await findUserById(req.session.user);
  const { token } = await generateUserToken(req.user);
  return res.status(200).json({ token });
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

router.patch('/update', profileUpload.single('photo'), async (req, res) => {
  const data = req.body;
  console.log('req.body = ', req.body);
  try {
    let photoUrl;
    if (!req.file) {
      ({ photo_url: photoUrl } = await db('users').first('photo_url').where('username', data.username));
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
        photo_url: req.file?.pathname ?? photoUrl,
        contact_number1: data.contactNumber1,
        contact_number2: data.contactNumber2,
        bio: data.bio,
      })
      .returning('*');

    console.log('update', update);

    const { base, cell } = await getBaseAndCell(update.base_id, update.cell_id);
    const updatedUser = new User(
      update.username,
      update.first_name,
      update.last_name,
      update.email,
      update.base_id,
      update.cell_id,
      update.photo_url,
      [update.contact_number1, update.contact_number2],
      update.bio,
      base,
      cell,
      update.id
    );

    if (!update) {
      res.status(404).json({ message: 'User not found' });
    } else {
      console.log(`PATCH /user/update/  User Id:${data.username}`);
      const { token } = await generateUserToken(updatedUser, req.session.roles);
      return res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(`PATCH /user/update/   User: ${data.username} ERROR: ${err}`);
  }
});

export default router;
