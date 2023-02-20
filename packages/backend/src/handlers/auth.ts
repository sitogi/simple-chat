import { NextFunction, Request, Response } from 'express';

import { createUser, getUser, login, refreshAccessToken, revokeRefreshToken, UnauthorizedError } from '~/services/auth';

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userWithToken = await login(req);
    res.status(200).json(userWithToken);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error.message);
    }
    next(error);
  }
};

export const authUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await getUser(req.uid);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const tokenRefreshHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const token = await refreshAccessToken(refreshToken);
    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await revokeRefreshToken(req.uid);
    res.status(200).json();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).send(error.message);
    }
    next(error);
  }
};

export const signUpHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userWithTokens = await createUser(req);
    res.status(200).json(userWithTokens);
  } catch (error) {
    next(error);
  }
};
