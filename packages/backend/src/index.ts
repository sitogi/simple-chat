import cors from 'cors';
import express from 'express';
import { pinoHttp as pino } from 'pino-http';

import { authUserHandler, loginHandler, logoutHandler, signUpHandler, tokenRefreshHandler } from '~/handlers/auth';
import { verifyToken } from '~/middlewares/verifyToken';

const app = express();

app.use(
  pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => ({ level: label }),
    },
  }),
);
app.use(express.json());
app.use(cors()); // TODO: 全部許可やめる
app.use(express.urlencoded({ extended: true }));

app.post('/auth/login', loginHandler);
app.get('/auth/user', verifyToken, authUserHandler);
app.post('/auth/token-refresh', tokenRefreshHandler);
app.post('/auth/logout', verifyToken, logoutHandler);
app.post('/auth/signup', signUpHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log('Express listening on port ' + (process.env.PORT || 3000));
});
