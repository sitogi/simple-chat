import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { exclude, prisma } from '~/libs/prisma';
import { CreateUserResponse, Tokens, UserWithoutPassword } from '~/types/auth';
import { BadRequestError, UnauthorizedError, UserNotFoundError } from '~/types/errors';

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

export const generateTokens = (uid: string): Tokens => {
  return { accessToken: generateAccessToken(uid), refreshToken: generateRefreshToken(uid) };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const { uid } = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;

    return { accessToken: generateAccessToken(uid) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : undefined;
    throw new UnauthorizedError(msg);
  }
};

export const createUser = async (req: Request): Promise<CreateUserResponse | null> => {
  return prisma.$transaction(async (tx) => {
    const { name, email, password } = req.body;

    if (!email) {
      throw new BadRequestError('email is required');
    }

    if (!password) {
      throw new BadRequestError('email is required');
    }

    if (!name) {
      throw new BadRequestError('name is required');
    }

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

    if (!email) {
      throw new BadRequestError('email is required.');
    }

    if (!password) {
      throw new BadRequestError('password is required.');
    }

    const user = await tx.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedError('Email or password is incorrect.');
    }

    const isOk = await bcrypt.compare(password, user.password);
    if (!isOk) {
      throw new UnauthorizedError('Email or password is incorrect.');
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
    throw new UserNotFoundError();
  }

  const userWithoutPassword = exclude(user, ['password']);

  return userWithoutPassword;
};
