import express from 'express';
import { v4 as uuid } from 'uuid';
import {
  addUser,
  comparePassword,
  doesUserExist,
  findUser,
  findUserRoles,
  generateUserToken,
  validUser,
} from '../Services/LoginService.js';

const router = express.Router();

// This is a test route
// TODO: Remove it
// :3001/user/
router.get('/', async (req, res, next) => {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  try {
    req.session.regenerate(err => {
      console.log(process.env.DEBUG);
      console.log('session regen');
      console.log(req.session);
      if (err) next(err);

      // store user information in session, typically a user id
      req.session.user = uuid();

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      /* eslint-disable-next-line consistent-return */
      req.session.save(e => {
        console.log('session save');
        console.log(req.session);
        if (e) return next(e);
        res.redirect('/user/protected');
      });
    });
    // const users = await db('users').select();
    // const token = generateAccessToken('Jon M');
    // res.send(token);
  } catch (e) {
    res.status(500);
    next(e);
  }
});

// signup
//  - post
//  check db for username
//  insert new user
//  generate token
//  respond with token
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

      res.status(201).json({ token });
    } else {
      res.status(401).json('User already exists');
    }
  } catch (e) {
    console.error('There was an error. ', e);
    res.status(500).send({ error: e.message });
  }
});

// 3001/users/signin
// - post
// check db for user
// check password
// verify jwtid
// send token
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
          req.session.regenerate(async regenErr => {
            if (regenErr) throw new Error(regenErr);

            req.session.roles = await findUserRoles(user.id);
            req.session.user = user.id;

            req.session.save(async saveErr => {
              if (saveErr) throw new Error(saveErr);

              const { token } = await generateUserToken(user);

              res.status(200).json({ token });
            });
          });
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
