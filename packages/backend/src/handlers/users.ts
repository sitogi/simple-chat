import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
  const { name, email, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPass },
  });
  return user;
};

export const deleteUser = async (req: Request<{ id: string }>): Promise<User | null> => {
  const user = await prisma.user.delete({
    where: { id: parseInt(req.params?.id) },
  });
  return user;
};

const JWT_SECRET_KEY = 'YOUR_SECRET_KEY';

export const login = async (req: Request): Promise<{ token: string } | null> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error('user not found');
  }

  const isOk = await bcrypt.compare(password, user.password);

  if (!isOk) {
    throw new Error('wrong password');
  }

  const payload: JwtPayload = {
    uid: user.id,
  };
  const option = {};
  const token = jwt.sign(payload, JWT_SECRET_KEY, option);
  return { token };
};
