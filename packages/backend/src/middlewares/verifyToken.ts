import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { accessTokenSecret } from '~/services/auth';
import { setUidToRequest } from '~/utils/requestUtils';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers['authorization'];

    if (bearerToken == null) {
      return res.status(400).json({ message: 'No token' });
    }

    const token = bearerToken.split(' ')[1];

    if (token == null) {
      return res.status(400).json({ message: 'No token' });
    }

    jwt.verify(token, accessTokenSecret, { ignoreExpiration: false }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        setUidToRequest(req, (decoded as JwtPayload).uid);
        next();
      }
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'unexpected error';

    return res.status(401).json({ message: errorMsg });
  }
};
