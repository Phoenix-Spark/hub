import bcrypt from 'bcrypt';
import db from '../db.js';
import generateAccessToken from './TokenService.js';

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
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} email
   * @param {number} baseId
   * @param {number} cellId
   * @param {string} photo
   * @param {Array} contactNumbers
   * @param {string} bio
   * @param {string|null} password
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

async function getUser(username) {
  return db('users').where('username', username).first();
}

export async function findUser(username) {
  const dbUser = await getUser(username);
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
}

/**
 *
 * @param userId
 * @returns {Promise<Array>}
 */
export async function findUserRoles(userId) {
  return db('permissions').select().where('users_id', userId);
}

/**
 * Checks the DB for the specified username
 * @param {string} username
 */
export async function doesUserExist(username) {
  const dbUser = await getUser(username);
  return !!dbUser;
}

export async function hashPassword(plaintext) {
  const saltRounds = 10;
  return bcrypt.hash(plaintext, saltRounds);
}

export async function comparePassword(plaintext, hashed) {
  return bcrypt.compare(plaintext, hashed);
}

export async function addUser({ baseId, cellId, username, password, firstName, lastName, email, photo, contactNumbers, bio }) {
  const hash = await hashPassword(password);
  const user = new User(username, firstName, lastName, email, baseId, cellId, photo, contactNumbers, bio, hash);

  // const newUser = await db('users').insert({
  //   base_id: user.baseId,
  //   cell_id: user.cellId,
  //   username: user.username,
  //   password: user.password,
  //   first_name: user.firstName,
  //   last_name: user.lastName,
  //   email: user.email,
  //   photo_url: user.photo,
  //   contact_number1: user.contactNumbers[0] ?? '',
  //   contact_number2: user.contactNumbers[1] ?? '',
  //   bio: user.bio,
  // });

  user.id = 10; // newUser.id;

  // new user has no real permissions
  const { token } = generateAccessToken(user, []);
  return { user, token };
}

export async function generateUserToken(user) {
  const roles = await findUserRoles(user.id);
  const { token } = generateAccessToken(user, roles);

  return { token };
}

export async function validUser(userId) {
  const dbUser = await db('users').select().where('id', userId).first();
  return !!dbUser;
}
