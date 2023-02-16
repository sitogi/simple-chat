import { extendTheme } from '@chakra-ui/react';

export const chakraTheme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
});
