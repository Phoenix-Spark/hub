import bcrypt from 'bcrypt';
import db from '../db.js';
import generateAccessToken from './TokenService.js';

export class User {
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
   * @param base
   * @param cell
   * @param {number|undefined} id
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
    base = undefined,
    cell = undefined,
    id = undefined
  ) {
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
    this.base = base;
    this.cell = cell;
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

export async function getBaseAndCell(baseId, cellId) {
  const base = await db('base').select('base_name').where('id', baseId).first();

  const cell = await db('cell').select('cell_name').where('id', cellId).first();

  return { base: base.base_name, cell: cell.cell_name };
}

async function findUser(username) {
  const dbUser = await getUserByField(username);
  if (!dbUser) return { user: undefined, password: undefined };

  const { base, cell } = await getBaseAndCell(dbUser.base_id, dbUser.cell_id);

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
      base,
      cell,
      dbUser.id
    ),
    password: dbUser.password,
  };
}

export async function findUserById(id) {
  // const dbUser = await db('users').where('id', id).first();
  const dbUser = await getUserByField(id, 'id');

  if (!dbUser) return undefined;

  const { base, cell } = await getBaseAndCell(dbUser.base_id, dbUser.cell_id);

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
    base,
    cell,
    dbUser.id
  );
}

/**
 *
 * @param userId
 * @returns {Promise<string>}
 */
export async function getUserRoles(userId) {
  const data = await db('permissions').select('roles').where('users_id', userId).first();
  return data.roles;
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
 * @param filename
 * @returns {Promise<User>}>}
 */
export async function addUser({ baseId, cellId, username, password, firstName, lastName, email, contactNumbers, bio }, { filename }) {
  // eslint-disable-next-line no-param-reassign
  baseId = baseId ?? 1;
  // eslint-disable-next-line no-param-reassign
  cellId = cellId ?? 1;
  const hash = await hashPassword(password);
  const { base, cell } = await getBaseAndCell(baseId, cellId);
  const user = new User(username, firstName, lastName, email, baseId, cellId, filename, contactNumbers, bio, base, cell);

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

  // set default role
  await db('permissions').insert({
    users_id: user.id,
    roles: '',
  });

  return user;
}

// async function generateSession(user, session) {
//   const roles = await getUserRoles(user.id);

//   session.regenerate(regenErr => {
//     if (regenErr) throw new Error(regenErr);

//     try {
//       // eslint-disable-next-line no-param-reassign
//       session.roles = roles;
//       // eslint-disable-next-line no-param-reassign
//       session.user = user.id;

//       session.save(saveErr => {
//         if (saveErr) throw new Error(saveErr);
//       });
//     } catch (e) {
//       throw new Error(e);
//     }
//   });
// }

export async function generateUserToken(user) {
  const roles = await getUserRoles(user.id);
  const { token } = generateAccessToken(user, roles);

  return { token };
}

export async function loginUser(user) {
  const roles = await getUserRoles(user.id);
  const { token } = await generateUserToken(user, roles);
  // await generateSession(user, session, cb, token);
  return { token, roles };
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
