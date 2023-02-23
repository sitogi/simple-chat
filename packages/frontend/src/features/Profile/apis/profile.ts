import { isAxiosError } from 'axios';

import axios from '~/libs/axios';

type Profile = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function fetchProfile(): Promise<{ profile: Profile }> {
  try {
    const response = await axios.get('profile');
    const profile = response.data;

    return { profile };
  } catch (e) {
    if (isAxiosError(e)) {
      throw new Error(e.response?.data);
    }

    throw e;
  }
}
