import { User } from '@prisma/client';
import { Request } from 'express';

import { prisma } from '../libs/prisma';

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};

export const getUser = async (req: Request<{ id: string }>): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params?.id) },
  });
  return user;
};

export const updateUser = async (req: Request<{ id: string }>): Promise<User | null> => {
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: parseInt(req.params?.id) },
    data: { name, email },
  });
  return user;
};

export const createUser = async (req: Request): Promise<User | null> => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email },
  });
  return user;
};

export const deleteUser = async (req: Request<{ id: string }>): Promise<User | null> => {
  const user = await prisma.user.delete({
    where: { id: parseInt(req.params?.id) },
  });
  return user;
};
