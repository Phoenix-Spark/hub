import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid, validate as validateUuid } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../db.js';

/**
 *
 * @param {*} username
 * @param {*} genUuid
 * @param {*} prevUuid
 * @returns { token: JWT, jwtid: UUID}
 */
const generateAccessToken = (username, genUuid = true, prevUuid = null) => {
  const admin = username === 'Jon M';
  const tokenUuid = genUuid ? uuid() : prevUuid;
  return {
    token: jwt.sign({ username, permissions: { admin } }, process.env.TOKEN_SECRET || 'secret', {
      issuer: 'tankvana', // where was the JWT issued
      subject: username, // the user of the JWT
      audience: `${username} at tankvana`, // the intended recipient of the JWT
      expiresIn: 1800,
      jwtid: tokenUuid, // UUID of the JWT
    }),
    jwtid: tokenUuid,
  };
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
router.post('/signup', async (req, res, next) => {
  const newUser = (await db('users').select('*').where({ username: req.body.un })).length === 0;
  if (newUser) {
    const { token, jwtid } = generateAccessToken(req.body.un);
    // db call to insert username and id...
    const hash = pwHash(req.body.pw);
    try {
      await db('users').insert({
        username: req.body.un,
        password: hash,
        issued_jwt_id: jwtid,
        issued_jwt_expiration: '',
      });

      res.status(201).json(token);
    } catch (e) {
      next(e);
    }
  } else {
    res.status(401).json(null);
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
    // req.body.pw
    // req.body.un

    if (!req.body.un || !req.body.pw) {
      return res.status(400).json('Username and password required');
    }

    const user = await db('users').where('username', req.body.un).first();

    if (user === undefined) {
      res.status(404).json('Incorrect username');
    } else {
      bcrypt.compare(req.body.pw, user.password, async (err, valid) => {
        if (valid) {
          let token;
          let jwtid;
          if (user.issued_jwt_id && validateUuid(user.issued_jwt_id)) {
            ({ token } = generateAccessToken(req.body.un, false, user.issued_jwt_id));
          } else {
            ({ token, jwtid } = generateAccessToken(req.body.un));
            await db('users').where({ id: user.id }).update({ issued_jwt_id: jwtid });
          }
          res.status(200).json(token);
        } else {
          res.status(401).json('Incorrect password');
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
