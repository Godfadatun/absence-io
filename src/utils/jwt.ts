/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-shadow */
import jwt, { SignOptions, sign } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { RequestHandler } from 'express';
import { theResponse } from './interface';

export function signToken(payload: string | Record<string, string>, key: string): string {
  return jwt.sign(payload, key);
}

export function decodeToken(token: string, key: string): theResponse & { data?: { id: string } } {
  try {
    const decrypted = jwt.verify(token, key) as { first_name: string; userId: string };
    return { success: true, message: 'Session authenticated', data: { id: decrypted.userId } };
  } catch (error) {
    return { success: false, error: 'Invalid or expired token provided.' };
  }
}

export function generateToken(data: any) {
  // information to be encoded in the JWT
  const { first_name, id: userId } = data;
  const payload = {
    first_name,
    userId,
    accessTypes: ['getTeams', 'addTeams', 'updateTeams', 'deleteTeams'],
  };
  // read private key value
  // const privateKey = fs.readFileSync(path.join(__dirname, './../../../private.key'));

  const signInOptions: SignOptions = {
    // RS256 uses a public/private key pair. The API provides the private key
    // to generate the JWT. The client gets a public key to validate the
    // signature
    // algorithm: 'RS256',
    expiresIn: '1h',
  };

  // generate JWT
  return sign(payload, 'privateKey', signInOptions);
}

export const validateSession: RequestHandler = (req, res, next) => {
  const Authorization = req.headers.authorization;
  if (!Authorization) {
    return res.status(401).json({
      success: false,
      error: 'Request unauthorized',
    });
  }
  const [, token] = Authorization.split('Bearer ');
  const decodeResponse = decodeToken(token, 'privateKey');
  if (!decodeResponse.success) {
    return res.status(401).json(decodeResponse);
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  req.userId = String(decodeResponse.data!.id);
  return next();
};
