import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

/**
 *
 * @param {User} user
 * @param {string} roles
 * @returns { {issuer, subject, audience, expiresIn, jwtid}, jwtid: UUID }
 */
const generateAccessToken = (user, roles) => {
  const tokenUuid = uuid();
  const { username, email, firstName, lastName, contactNumbers, cell, cellId, base, baseId, photo, id } = user;
  const secret = process.env.TOKEN_SECRET || 'secret';
  return {
    token: jwt.sign({ user: { username, email, firstName, lastName, contactNumbers, cellId, cell, baseId, base, photo, roles, id } }, new TextEncoder().encode(secret), {
      issuer: 'capstone', // where was the JWT issued
      subject: user.username, // the user of the JWT
      audience: `${user.email} at capstone`, // the intended recipient of the JWT
      expiresIn: 1800,
      jwtid: tokenUuid, // UUID of the JWT
    }),
    jwtid: tokenUuid,
  };
};

export default generateAccessToken;
