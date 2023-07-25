import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

/**
 *
 * @param {User} user
 * @param {Array} roles
 * @returns { {issuer, subject, audience, expiresIn, jwtid}, jwtid: UUID }
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

export default generateAccessToken;
