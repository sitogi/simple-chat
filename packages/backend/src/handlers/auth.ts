import { Request } from 'express';

import { createUser, getUser, login, refreshAccessToken, revokeRefreshToken } from '~/services/auth';

export const loginHandler = async (req: Request) => {
  const userWithToken = await login(req);

  return userWithToken;
};

export const authUserHandler = async (req: Request) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const user = await getUser(req.uid);

  return user;
};

export const tokenRefreshHandler = async (req: Request) => {
  const { refreshToken } = req.body;
  const token = await refreshAccessToken(refreshToken);

  return token;
};

export const logoutHandler = async (req: Request) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await revokeRefreshToken(req.uid);

  return {};
};

export const signUpHandler = async (req: Request) => {
  const userWithTokens = await createUser(req);

  return userWithTokens;
};
