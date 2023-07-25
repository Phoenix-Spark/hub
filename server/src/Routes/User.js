import express from 'express';
import { addUser, comparePassword, doesUserExist, findUser, generateUserToken, loginUser, validUser } from '../Services/LoginService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    throw new Error('missing required arguments');
  }
  // does the user exist?
  const userDoesNotExist = (await doesUserExist(req.body.username)) === false;

  try {
    // User does not exist keep going
    if (userDoesNotExist) {
      const { user, token } = await addUser(req.body);
      await loginUser(user, req.session);

      res.status(201).json({ token });
    } else {
      res.status(401).json('User already exists');
    }
  } catch (e) {
    console.error('There was an error. ', e);
    res.status(500).send({ error: e.message });
  }
});

router.post(
  '/signin',
  /* eslint-disable-next-line consistent-return */
  async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json('Username and password required');
    }
    const user = await findUser(username);

    if (user === undefined) {
      res.status(401).json('Incorrect username or password');
    } else {
      try {
        const validPass = await comparePassword(password, user.password);

        if (validPass) {
          await loginUser(user, req.session);
          const { token } = await generateUserToken(user);

          res.status(200).json({ token });
        } else {
          res.status(401).json('Incorrect username or password');
        }
      } catch (e) {
        console.error(e);
        res.status(500).send({ error: e.message });
      }
    }
  }
);

router.get('/logout', (req, res, next) => {
  req.session.user = null;
  req.session.save(saveErr => {
    if (saveErr) throw new Error(saveErr);

    req.session.regenerate(regenErr => {
      if (regenErr) throw new Error(regenErr);
      res.status(200).json({ message: 'logout complete' });
    });
  });
});

router.get(
  '/protected',
  /* eslint-disable-next-line consistent-return */
  async (req, res) => {
    console.log('after auth');
    console.log(req.session);
    if (req.session.user) {
      const valid = await validUser(req.session.user);
      if (valid) {
        return res.status(200).send(`Welcome!, ${req.session.user}`);
      }
    }
    return res.sendStatus(401);
  },
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Token was invalid.');
    } else {
      next(err);
    }
  }
);

export default router;
