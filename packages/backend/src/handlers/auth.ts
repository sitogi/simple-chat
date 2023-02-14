import bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { prisma } from '../libs/prisma';

// TODO: もろもろ環境変数化
const JWT_ID_TOKEN_SECRET_KEY = 'ID_TOKEN_SECRET_KEY';
const JWT_REFRESH_TOKEN_SECRET_KEY = 'REFRESH_TOKEN_SECRET_KEY';

const generateAccessToken = (uid: string): string => {
  const after2Hours = add(new Date(), { hours: 2 });

  const accessToken = jwt.sign({ uid, exp: after2Hours }, JWT_ID_TOKEN_SECRET_KEY, {});

  return accessToken;
};

const generateRefreshToken = (uid: string): string => {
  const after2Minutes = add(new Date(), { minutes: 2 });

  const refreshToken = jwt.sign({ uid, exp: after2Minutes }, JWT_REFRESH_TOKEN_SECRET_KEY, {});

  return refreshToken;
};

export const generateTokens = (uid: string): { accessToken: string; refreshToken: string } => {
  return { accessToken: generateAccessToken(uid), refreshToken: generateRefreshToken(uid) };
};

export const refreshTokens = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const { uid } = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET_KEY) as JwtPayload;

    return { accessToken: generateAccessToken(uid), refreshToken: generateRefreshToken(uid) };
  } catch (e) {
    throw new Error('unauthorized');
  }
};

export const login = async (req: Request): Promise<{ accessToken: string; refreshToken: string } | null> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('User not found or wrong password');
  }

  const isOk = await bcrypt.compare(password, user.password);

  if (!isOk) {
    throw new Error('User not found or wrong password');
  }

  return generateTokens(String(user.id));
};
