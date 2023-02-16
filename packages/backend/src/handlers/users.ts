import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';

import { exclude, prisma } from '../libs/prisma';

import { generateTokens } from './auth';

export type UserWithoutPassword = Omit<User, 'password'>;

type CreateUserResponse = {
  user: UserWithoutPassword;
} & ReturnType<typeof generateTokens>;

export const createUser = async (req: Request): Promise<CreateUserResponse | null> => {
  const { name, email, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPass },
  });
  const userWithoutPass = exclude(user, ['password']);

  const tokens = generateTokens(String(user.id));

  return { user: userWithoutPass, ...tokens };
};

export const getUsers = async (): Promise<UserWithoutPassword[]> => {
  const users = await prisma.user.findMany();

  return users.map((u) => exclude(u, ['password']));
};

export const updateUser = async (req: Request): Promise<UserWithoutPassword | null> => {
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: parseInt(req.params?.id) },
    data: { name, email },
  });

  return exclude(user, ['password']);
};

export const deleteUser = async (req: Request): Promise<UserWithoutPassword | null> => {
  const user = await prisma.user.delete({
    where: { id: parseInt(req.params?.id) },
  });

  return exclude(user, ['password']);
};
