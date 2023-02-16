import { Button, FormControl, FormLabel, Grid, Input, Stack } from '@chakra-ui/react';

export const Login = (): JSX.Element => {
  return (
    <Grid placeContent="center" h="100vh" w="100vw" bg="gray.800">
      <Stack w={80} gap={4}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button colorScheme="green">Login</Button>
      </Stack>
    </Grid>
  );
};
