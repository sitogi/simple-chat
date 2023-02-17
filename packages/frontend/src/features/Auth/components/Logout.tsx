import { Button } from '@chakra-ui/react';

import { useAuthContext } from '~/features/Auth/contexts/authContext';

export const Logout = (): JSX.Element => {
  const { logout } = useAuthContext();

  return (
    <Button type="submit" colorScheme="pink" onClick={async () => await logout()}>
      Logout
    </Button>
  );
};
