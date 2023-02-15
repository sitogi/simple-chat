import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Exclude specific keys from Models
export function exclude<T, Key extends keyof T>(model: T, keys: Key[]): Omit<T, Key> {
  for (const key of keys) {
    delete model[key];
  }

  return model;
}
