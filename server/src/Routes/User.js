import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../db.js';

class User {
  id;

  baseId;

  cellId;

  username;

  password;

  firstName;

  lastName;

  email;

  photo;

  contactNumbers;

  bio;

  /**
   *
   * @param {string} username
   * @param {string} password
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {number} baseId
   * @param {number} cellId
   * @param {string} photo
   * @param {Array} contactNumbers
   * @param {string} bio
   */
  constructor(
    username,
    firstName,
    lastName,
    email,
    baseId = 1,
    cellId = 1,
    photo = '',
    contactNumbers = [],
    bio = '',
    password = null,
    id = undefined
  ) {
    this.baseId = baseId;
    this.cellId = cellId;
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.photo = photo;
    this.contactNumbers = contactNumbers;
    this.bio = bio;
    this.id = id;
  }
}

/**
 *
 * @param {User} user
 * @returns { token: JWT, jwtid: UUID}
 */
const generateAccessToken = (user, roles) => {
  const tokenUuid = uuid();
  return {
    token: jwt.sign({ user: user.id, roles }, process.env.TOKEN_SECRET || 'secret', {
      issuer: 'capstone', // where was the JWT issued
      subject: user.username, // the user of the JWT
      audience: `${user.email} at capstone`, // the intended recipient of the JWT
      expiresIn: 1800,
      jwtid: tokenUuid, // UUID of the JWT
    }),
    jwtid: tokenUuid,
  };
};

const getUser = async username => {
  const dbUser = await db('users').where('username', username).first();
  if (!dbUser) return undefined;

  return new User(
    dbUser.username,
    dbUser.first_name,
    dbUser.last_name,
    dbUser.email,
    dbUser.base_id,
    dbUser.cell_id,
    dbUser.photo_url,
    [dbUser.contact_number1, dbUser.contact_number2],
    dbUser.bio,
    dbUser.password,
    dbUser.id
  );
};

const pwHash = pw => bcrypt.hashSync(pw, 10);

const router = express.Router();

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
  // does the user exist?
  try {
    if (!req.body.username || !req.body.password) {
      throw new Error('missing required arguments');
    }
    const userDoesNotExist = (await getUser(req.body.username)) === undefined;

    // User does not exist keep going
    if (userDoesNotExist) {
      // const { token, jwtid } = generateAccessToken(req.body.username);
      // db call to insert username and id...
      const { baseId, cellId, username, password, firstName, lastName, email, photo, contactNumbers, bio } = req.body;
      const hash = pwHash(password);
      const user = new User(username, firstName, lastName, email, baseId, cellId, photo, contactNumbers, bio, hash);
      const newUser = await db('users').insert({
        base_id: user.baseId,
        cell_id: user.cellId,
        username: user.username,
        password: user.password,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        photo_url: user.photo,
        contact_number1: user.contactNumbers[0] ?? '',
        contact_number2: user.contactNumbers[1] ?? '',
        bio: user.bio,
      });
      user.id = newUser.id;
      console.log({ ...user });
      res.status(201).json(user);
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
    const user = await getUser(username);

    if (user === undefined) {
      res.status(401).json('Incorrect username or password');
    } else {
      bcrypt.compare(password, user.password, async (err, valid) => {
        if (err) {
          throw new Error(err);
        }
        if (valid) {
          const roles = await db('permissions').select().where('users_id', user.id);
          const { token } = generateAccessToken(user, roles);

          console.log('user', user, roles);

          try {
            req.session.regenerate(regenErr => {
              console.log('session regen');
              if (regenErr) throw new Error(regenErr);
              // store user information in session, typically a user id
              req.session.user = user.id;
              // save the session before redirection to ensure page
              // load does not happen before session is saved
              /* eslint-disable-next-line consistent-return */
              req.session.save(saveErr => {
                console.log('session save');
                console.log(req.session);
                if (saveErr) throw new Error(saveErr);
                res.status(200).json({ token });
              });
            });
          } catch (e) {
            console.error(e);
            res.status(500).send({ error: e.message });
          }
        } else {
          res.status(401).json('Incorrect username or password');
        }
      });
    }
  }
);

router.get(
  '/protected',
  /* eslint-disable-next-line consistent-return */
  (req, res) => {
    console.log('after auth');
    console.log(req.session);
    if (!req.session.user) return res.sendStatus(401);

    res.status(200).send(`Welcome!, ${req.session.user}`);
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
