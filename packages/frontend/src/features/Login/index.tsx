import { Button, FormControl, FormLabel, Grid, Input, Stack, Text } from '@chakra-ui/react';

export const Login = (): JSX.Element => {
  return (
    <Grid placeContent="center" h="100vh" w="100vw" bg="gray.800">
      <Stack w={80} gap={4}>
        <FormControl>
          <FormLabel>
            <Text>Email address</Text>
          </FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>
            <Text>Password</Text>
          </FormLabel>
          <Input type="password" />
        </FormControl>
        <Button>Login</Button>
      </Stack>
    </Grid>
  );
};
