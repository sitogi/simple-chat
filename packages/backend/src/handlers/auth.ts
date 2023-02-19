import { Request, Response } from 'express';

import { createUser, getUser, login, refreshAccessToken, revokeRefreshToken, UnauthorizedError } from '~/services/auth';

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const userWithToken = await login(req);
    res.status(200).json(userWithToken);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).send(err.message);
    }
    console.error(err);
    res.status(500).send('internal error');
  }
};

export const authUserHandler = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await getUser(req.uid);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
};
export const tokenRefreshHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const token = await refreshAccessToken(refreshToken);
    res.status(200).json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await revokeRefreshToken(req.uid);
    res.status(200).json();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).send(err.message);
    }
    console.error(err);
    res.status(500).send('internal error');
  }
};

export const signUpHandler = async (req: Request, res: Response) => {
  try {
    // TODO: 本当は色々バリデーションする
    const userWithTokens = await createUser(req);
    res.status(200).json(userWithTokens);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
};
