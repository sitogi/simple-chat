import { User } from '@prisma/client';

export type Tokens = { accessToken: string; refreshToken: string };

export type UserWithoutPassword = Omit<User, 'password'>;

export type CreateUserResponse = {
  user: UserWithoutPassword;
} & Tokens;
