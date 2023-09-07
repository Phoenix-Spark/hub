import bcrypt from 'bcrypt';
import db from '../Database/index.js';
import generateAccessToken from './TokenService.js';
import type { Role, User } from '../types';
import { userRepository } from '../app.js';

export async function doesUserExist(username: string) {
  const dbUser = await userRepository.getUserId(username);
  return !!dbUser;
}

async function hashPassword(plaintext: string) {
  const saltRounds = 10;
  return bcrypt.hash(plaintext, saltRounds);
}

async function comparePassword(plaintext: string, hashed: string) {
  return bcrypt.compare(plaintext, hashed);
}

export async function addUser(
  { baseId, cellId, username, password, firstName, lastName, email, contactNumbers, bio }: User,
  { filename }: { filename: string }
): Promise<User> {
  // eslint-disable-next-line no-param-reassign
  baseId = baseId ?? 1;
  // eslint-disable-next-line no-param-reassign
  cellId = cellId ?? 1;
  let hash = '';
  if (password) {
    hash = await hashPassword(password);
  }
  const { base, cell } = await userRepository.getBaseAndCell(baseId, cellId);
  const user: User = {
    username,
    firstName,
    lastName,
    email,
    baseId,
    cellId,
    photoUrl: filename,
    contactNumbers,
    bio,
    base,
    cell,
  };

  const newUser = await db('users').insert(
    {
      base_id: user.baseId ?? 1,
      cell_id: user.cellId ?? 1,
      username: user.username,
      password: hash,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      photo_url: user.photoUrl,
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

export async function generateUserToken(user: User) {
  let roles: Role[] = [];
  let token;

  if (user.id) {
    roles = await userRepository.getUserRoles(user.id);
    ({ token } = generateAccessToken(user, roles));
  } else {
    throw new Error('User session does not exist');
  }

  return { token, roles };
}

export async function loginUser(user: User) {
  if (user.id) {
    const { token, roles } = await generateUserToken(user);
    // await generateSession(user, session, cb, token);
    return { token, roles };
  }
  return false;
}

export async function validateLogin(username: string, plaintext: string) {
  const user = await userRepository.findByUsernameWithPass(username);

  if (user && user.password) {
    const validPass = await comparePassword(plaintext, user.password);
    if (validPass) {
      delete user.password;
      return user;
    }
  }

  return undefined;
}
