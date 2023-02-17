import { FormEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  Heading,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { PATH_SIGNUP } from '~/common/constants';
import { useAuthContext } from '~/features/Auth/contexts/authContext';

export const Login = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuthContext();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setErrorMsg('');
      await login(email, password);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unexpected Error';
      setErrorMsg(msg);
    }
  };

  return (
    <Grid placeContent="center" h="100vh" w="100vw" bg="black" gap={8}>
      <Heading mx="auto"> Login </Heading>
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
      <VStack>
        <Text>{`Don't have an account?`}</Text>
        <Link as={RouterLink} to={PATH_SIGNUP} color="blue.200">
          Sign Up
        </Link>
      </VStack>
    </Grid>
  );
};
