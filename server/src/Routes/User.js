import express from 'express';
import { addUser, doesUserExist, findUserById, generateUserToken, loginUser, validateLogin } from '../Services/LoginService.js';

const router = express.Router();

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
      for (const item in req.body) {
        req.body[item] = encodeURIComponent(req.body[item]);
      }

      const user = await addUser(req.body, req.file ?? { filename: '' });

      const { token } = await loginUser(user, req.session);

      return res.status(201).json({ token });
    }
    return res.status(401).json('User already exists');
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

export default router;
