import bcrypt from 'bcrypt';
import db from '../db';
import generateAccessToken from './TokenService';
import { Role, User } from '../types';

async function getUserByField(
  value: number | string | null = null,
  field = 'username'
): Promise<User | null | undefined> {
  if (!value) throw new Error('Value required.');
  return db('users').where(field, value).first();
}

export async function getBaseAndCell(
  baseId: number,
  cellId: number
): Promise<{ base: string | undefined; cell: string | undefined }> {
  const base = await db('base').select('base_name').where('id', baseId).first();

  const cell = await db('cell').select('cell_name').where('id', cellId).first();

  return { base: base.base_name, cell: cell.cell_name };
}

export async function findUser(
  username: string
): Promise<{ user: User | undefined; password: string | undefined }> {
  const dbUser = await getUserByField(username);
  if (!dbUser) return { user: undefined, password: undefined };

  let base;
  let cell;

  if (dbUser.baseId && dbUser.cellId) {
    ({ base, cell } = await getBaseAndCell(dbUser.baseId, dbUser.cellId));
  }

  dbUser.base = base;
  dbUser.cell = cell;

  return {
    user: dbUser,
    password: dbUser.password,
  };
}

export async function findUserById(id: number): Promise<User | undefined> {
  // const dbUser = await db('users').where('id', id).first();
  const dbUser = await getUserByField(id, 'id');

  if (!dbUser) return undefined;

  const { base, cell } = await getBaseAndCell(dbUser.baseId, dbUser.cellId);

  dbUser.base = base;
  dbUser.cell = cell;

  return dbUser;
}

export async function getUserRoles(userId: number): Promise<Role[]> {
  const data = await db('permissions').select('roles').where('users_id', userId).first();
  return data.roles;
}

export async function doesUserExist(username: string) {
  const dbUser = await getUserByField(username);
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
  const { base, cell } = await getBaseAndCell(baseId, cellId);
  const user: User = {
    username,
    firstName,
    lastName,
    email,
    baseId,
    cellId,
    photo: filename,
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

export async function generateUserToken(user: User) {
  let roles: Role[] = [];
  let token;

  if (user.id) {
    roles = await getUserRoles(user.id);
    ({ token } = generateAccessToken(user, roles));
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
  const { user, password } = await findUser(username);

  if (user && password) {
    const validPass = await comparePassword(plaintext, password);
    if (validPass) {
      return user;
    }
  }

  return undefined;
}
