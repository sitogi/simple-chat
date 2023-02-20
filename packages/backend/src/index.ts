import cors from 'cors';
import express from 'express';

import { authUserHandler, loginHandler, logoutHandler, signUpHandler, tokenRefreshHandler } from '~/handlers/auth';
import { errorHandler } from '~/handlers/error';
import { loggingHandler } from '~/handlers/logging';
import { verifyToken } from '~/middlewares/verifyToken';

const app = express();

app.use(loggingHandler);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post('/auth/login', loginHandler);
app.get('/auth/user', verifyToken, authUserHandler);
app.post('/auth/token-refresh', tokenRefreshHandler);
app.post('/auth/logout', verifyToken, logoutHandler);
app.post('/auth/signup', signUpHandler);

app.use(errorHandler); // 包括的エラーハンドリングはすべてのルートよりもあとに use する必要がある

app.listen(process.env.PORT || 3000, () => {
  console.log('Express listening on port ' + (process.env.PORT || 3000));
});
