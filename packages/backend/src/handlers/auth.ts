import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { prisma } from '../libs/prisma';

// TODO: 環境変数アクセスを config みたいなものにまとめる
export const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY || '';
export const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY || '';

const generateAccessToken = (uid: string): string => {
  const accessToken = jwt.sign({ uid }, accessTokenSecret, { expiresIn: '20s' });

  return accessToken;
};

const generateRefreshToken = (uid: string): string => {
  const refreshToken = jwt.sign({ uid }, refreshTokenSecret, { expiresIn: '20m' });

  return refreshToken;
};

export const generateTokens = (uid: string): { accessToken: string; refreshToken: string } => {
  return { accessToken: generateAccessToken(uid), refreshToken: generateRefreshToken(uid) };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const { uid } = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    return { accessToken: generateAccessToken(uid) };
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
