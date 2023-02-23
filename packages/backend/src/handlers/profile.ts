import { Request } from 'express';

import { getProfile } from '~/services/profiles';
import { getUidFromRequest } from '~/utils/requestUtils';

export const getProfileHandler = async (req: Request) => {
  const uid = getUidFromRequest(req);
  const profile = await getProfile(uid);

  return profile;
};
