import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-unresolved
import { Role, User } from '../types';

const generateAccessToken = (user: User, roles: Role[]) => {
  const tokenUuid = uuid();
  const {
    username,
    email,
    firstName,
    lastName,
    contactNumbers,
    cell,
    cellId,
    base,
    baseId,
    photo,
    id,
  } = user;
  const secret = process.env.TOKEN_SECRET || 'secret';
  return {
    token: jwt.sign(
      {
        user: {
          username,
          email,
          firstName,
          lastName,
          contactNumbers,
          cellId,
          cell,
          baseId,
          base,
          photo,
          roles,
          id,
        },
      },
      new TextEncoder().encode(secret) as jwt.Secret,
      {
        issuer: 'capstone', // where was the JWT issued
        subject: user.username, // the user of the JWT
        audience: `${user.email} at capstone`, // the intended recipient of the JWT
        expiresIn: 1800,
        jwtid: tokenUuid, // UUID of the JWT
      }
    ),
    jwtid: tokenUuid,
  };
};

export default generateAccessToken;
