import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { exclude, prisma } from '~/libs/prisma';

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
    // TODO: ここが 500 で返ってしまわないようにする
    console.log(e);
    throw new Error('unauthorized');
  }
};

export class UnauthorizedError extends Error {
  constructor() {
    super('No user or wrong password');
  }
}

export type UserWithoutPassword = Omit<User, 'password'>;

type CreateUserResponse = {
  user: UserWithoutPassword;
} & ReturnType<typeof generateTokens>;

export const createUser = async (req: Request): Promise<CreateUserResponse | null> => {
  return prisma.$transaction(async (tx) => {
    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPass,
        profile: {
          create: { name },
        },
      },
    });
    const userWithoutPass = exclude(user, ['password']);
    const tokens = generateTokens(String(user.id));

    await tx.token.upsert({
      where: { userId: user.id },
      create: {
        userId: userWithoutPass.id,
        refreshToken: tokens.refreshToken,
      },
      update: {
        refreshToken: tokens.refreshToken,
      },
    });

    return { user: userWithoutPass, ...tokens };
  });
};

export const login = async (
  req: Request,
): Promise<{ user: UserWithoutPassword; accessToken: string; refreshToken: string } | null> => {
  return prisma.$transaction(async (tx) => {
    const { email, password } = req.body;
    const user = await tx.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedError();
    }

    const isOk = await bcrypt.compare(password, user.password);
    if (!isOk) {
      throw new UnauthorizedError();
    }

    const userWithoutPass = exclude(user, ['password']);
    const { accessToken, refreshToken } = generateTokens(String(user.id));

    await tx.token.upsert({
      where: { userId: userWithoutPass.id },
      create: {
        userId: userWithoutPass.id,
        refreshToken,
      },
      update: {
        refreshToken,
      },
    });

    return { user: userWithoutPass, accessToken, refreshToken };
  });
};

export const revokeRefreshToken = async (uid: string): Promise<void> => {
  await prisma.token.delete({
    where: { userId: parseInt(uid) },
  });
};

export const getUser = async (uid: string): Promise<UserWithoutPassword | null> => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(uid) },
  });

  if (user == null) {
    throw new Error('User not found');
  }

  const userWithoutPassword = exclude(user, ['password']);

  return userWithoutPassword;
};
