import { Request } from 'express';

import { createUser, getUser, login, refreshAccessToken, revokeRefreshToken } from '~/services/auth';
import { getUidFromRequest } from '~/utils/requestUtils';

export const loginHandler = async (req: Request) => {
  const userWithToken = await login(req);

  return userWithToken;
};

export const authUserHandler = async (req: Request) => {
  const uid = getUidFromRequest(req);
  const user = await getUser(uid);

  return user;
};

export const tokenRefreshHandler = async (req: Request) => {
  const { refreshToken } = req.body;
  const token = await refreshAccessToken(refreshToken);

  return token;
};

export const logoutHandler = async (req: Request) => {
  const uid = getUidFromRequest(req);
  await revokeRefreshToken(uid);

  return {};
};

export const signUpHandler = async (req: Request) => {
  const userWithTokens = await createUser(req);

  return userWithTokens;
};
