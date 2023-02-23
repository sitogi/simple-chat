import { useEffect, useState } from 'react';

import { Grid, Text, VStack } from '@chakra-ui/react';

import { Logout } from '~/features/Auth';
import { useAuthContext } from '~/features/Auth/contexts/authContext';
import { fetchProfile } from '~/features/Profile/apis/profile';

export const Profile = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProfile()
      .then((response) => setName(response.profile.name))
      .catch((error) => {
        const msg = error instanceof Error ? error.message : 'Unexpected error';
        setErrorMsg(msg);
      });
  }, []);

  return (
    <Grid placeContent="center" h="full" w="full">
      <VStack gap={4}>
        <Text>ログインしました</Text>
        {errorMsg !== '' && <Text>{`プロフィールの取得に失敗しました: ${errorMsg}`}</Text>}
        <Text>{`メールアドレス: ${user?.email}`}</Text>
        <Text>{`名前: ${name}`}</Text>
        <Logout />
      </VStack>
    </Grid>
  );
};
