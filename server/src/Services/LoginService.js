import bcrypt from 'bcrypt';
import db from '../db.js';
import generateAccessToken from './TokenService.js';

class User {
  id;
  baseId;
  base;
  cellId;
  cell;
  username;
  firstName;
  lastName;
  email;
  photo;
  contactNumbers;
  bio;

  /**
   *
   * @param {string} username
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {number} baseId
   * @param {number} cellId
   * @param {string} photo
   * @param {Array} contactNumbers
   * @param {string} bio
   * @param {number|undefined} id
   */
  constructor(username, firstName, lastName, email, baseId = 1, cellId = 1, photo = '', contactNumbers = [], bio = '', id = undefined) {
    this.baseId = baseId;
    this.cellId = cellId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.photo = photo;
    this.contactNumbers = contactNumbers;
    this.bio = bio;
    this.id = id;
    this.setBaseString();
    this.setCellString();
  }

  setBaseString() {
    db('base')
      .select('base_name')
      .where('id', this.baseId)
      .first()
      .then(result => {
        this.base = result.base_name;
      });
  }

  setCellString() {
    db('cell')
      .select('cell_name')
      .where('id', this.cellId)
      .first()
      .then(result => {
        this.cell = result.cell_name;
      });
  }
}

async function getUserByField(value = null, field = 'username') {
  if (!value) throw new Error('Value required.');
  return db('users').where(field, value).first();
}

async function findUser(username) {
  const dbUser = await getUserByField(username);
  if (!dbUser) return { user: undefined, password: undefined };

  return {
    user: new User(
      dbUser.username,
      dbUser.first_name,
      dbUser.last_name,
      dbUser.email,
      dbUser.base_id,
      dbUser.cell_id,
      dbUser.photo_url,
      [dbUser.contact_number1, dbUser.contact_number2],
      dbUser.bio,
      dbUser.id
    ),
    password: dbUser.password,
  };
}

export async function findUserById(id) {
  // const dbUser = await db('users').where('id', id).first();
  const dbUser = await getUserByField(id, 'id');
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
    dbUser.id
  );
}

/**
 *
 * @param userId
 * @returns {Promise<string>}
 */
async function findUserRoles(userId) {
  return db('permissions').select().where('users_id', userId).first();
}

/**
 * Checks the DB for the specified username
 * @param {string} username
 */
export async function doesUserExist(username) {
  const dbUser = await getUserByField(username);
  return !!dbUser;
}

async function hashPassword(plaintext) {
  const saltRounds = 10;
  return bcrypt.hash(plaintext, saltRounds);
}

async function comparePassword(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}

/**
 *
 * @param {User}
 * @returns {Promise<User>}>}
 */
export async function addUser({ baseId, cellId, username, password, firstName, lastName, email, photo, contactNumbers, bio }) {
  const hash = await hashPassword(password);
  const user = new User(username, firstName, lastName, email, baseId ?? 1, cellId ?? 1, photo, contactNumbers, bio);

  const newUser = await db('users').insert(
    {
      base_id: user.baseId ?? 1,
      cell_id: user.cellId ?? 1,
      username: user.username,
      password: hash,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      photo_url: user.photo,
      contact_number1: user.contactNumbers[0] ?? '',
      contact_number2: user.contactNumbers[1] ?? '',
      bio: user.bio,
    },
    ['id']
  );

  user.id = newUser[0].id;

  return user;
}

async function generateSession(user, session) {
  const roles = await findUserRoles(user.id);

  session.regenerate(regenErr => {
    if (regenErr) throw new Error(regenErr);

    try {
      // eslint-disable-next-line no-param-reassign
      session.roles = roles;
      // eslint-disable-next-line no-param-reassign
      session.user = user.id;

      session.save(saveErr => {
        if (saveErr) throw new Error(saveErr);
      });
    } catch (e) {
      throw new Error(e);
    }
  });
}

export async function generateUserToken(user) {
  const roles = await findUserRoles(user.id);
  const { token } = generateAccessToken(user, roles);

  return { token };
}

export async function loginUser(user, session) {
  await generateSession(user, session);
  const { token } = await generateUserToken(user);
  return { token };
}

export async function validateLogin(username, plaintext) {
  const { user, password } = await findUser(username);

  if (user && password) {
    const validPass = await comparePassword(plaintext, password);
    if (validPass) {
      return user;
    }
  }

  return undefined;
}
