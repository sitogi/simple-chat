import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';

import '~/index.css';
import { App } from '~/App';
import { chakraTheme } from '~/lib/chakra-theme';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={chakraTheme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
