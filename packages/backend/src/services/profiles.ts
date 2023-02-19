import { Profile } from '@prisma/client';

import { prisma } from '~/libs/prisma';

export const getProfile = async (uid: string): Promise<Profile | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId: parseInt(uid) },
  });

  if (profile == null) {
    throw new Error('User not found');
  }

  return profile;
};
