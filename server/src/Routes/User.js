import express from 'express';
import {
  addUser,
  comparePassword,
  doesUserExist,
  findUser,
  findUserById,
  generateSession,
  generateUserToken,
} from '../Services/LoginService.js';

const router = express.Router();

export async function signUpHandler(req, res) {
  if (!req.body.username || !req.body.password) {
    throw new Error('missing required arguments');
  }
  // does the user exist?
  const userDoesNotExist = (await doesUserExist(req.body.username)) === false;

  try {
    // User does not exist keep going
    if (userDoesNotExist) {
      const { user, token } = await addUser(req.body);
      await generateSession(user, req.session);

      res.status(201).json({ token });
    } else {
      res.status(401).json('User already exists');
    }
  } catch (e) {
    console.error('There was an error. ', e);
    res.status(500).send({ error: e.message });
  }
}

export async function loginHandler(req, res) {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json('Username and password required');
  }
  const user = await findUser(username);

  if (user === undefined) {
    return res.status(401).json('Incorrect username or password');
  }
  try {
    const validPass = await comparePassword(password, user.password);

    if (validPass) {
      await generateSession(user, req.session);
      const { token } = await generateUserToken(user);
      console.log(req.session);
      return res.status(200).json({ token });
    }
    return res.status(401).json('Incorrect username or password');
  } catch (e) {
    console.error(e);
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
  next();
});
router.get('/test', async (req, res) => {
  // const user = await findUserById(req.session.user);
  console.log('after auth');

  res.status(200).json({ message: `Welcome, ${req.user.firstName}!` });
});

// Used when the client first loads without any user details but a valid server session exists
router.get('/refresh', async (req, res) => {
  // const user = await findUserById(req.session.user);
  const { token } = await generateUserToken(req.user);
  return res.status(200).json({ token });
});

export default router;
