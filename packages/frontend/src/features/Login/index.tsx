import { FormEvent, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

import { PATH_ROOT } from '~/common/constants';
import { login } from '~/features/Login/apis/login';
import { useAuthContext } from '~/features/Login/contexts/authContext';

export const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { setContextUser } = useAuthContext();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setErrorMsg('');
      const { user } = await login(email, password);
      setContextUser(user);

      navigate(PATH_ROOT);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unexpected Error';
      setErrorMsg(msg);
    }
  };

  return (
    <Grid placeContent="center" h="100vh" w="100vw" bg="black">
      <Stack>
        {errorMsg !== '' && (
          <Alert status="error" rounded="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Failed to login</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Box>
          </Alert>
        )}
        <Grid placeContent="center" w="xl" p={8} bg="gray.900" rounded="md">
          <Stack as="form" onSubmit={onSubmit} w={80} gap={4}>
            <FormControl>
              <FormLabel htmlFor="mail">Email address</FormLabel>
              <Input
                id="mail"
                type="email"
                borderColor="gray.500"
                focusBorderColor="green.400"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="pass">Password</FormLabel>
              <Input
                id="pass"
                type="password"
                borderColor="gray.500"
                focusBorderColor="green.400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="green">
              Login
            </Button>
          </Stack>
        </Grid>
      </Stack>
    </Grid>
  );
};
