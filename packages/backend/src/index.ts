import express from 'express';

import { authUserHandler, loginHandler, logoutHandler, signUpHandler, tokenRefreshHandler } from '~/handlers/auth';
import { errorHandler } from '~/handlers/error';
import { loggingHandler } from '~/handlers/logging';
import { getProfileHandler } from '~/handlers/profile';
import { verifyToken } from '~/middlewares/verifyToken';
import { wrapApi } from '~/utils/apiWrapper';

const app = express();

app.use(loggingHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/auth/login', wrapApi(loginHandler));
app.get('/auth/user', verifyToken, wrapApi(authUserHandler));
app.post('/auth/token-refresh', wrapApi(tokenRefreshHandler));
app.post('/auth/logout', verifyToken, wrapApi(logoutHandler));
app.post('/auth/signup', wrapApi(signUpHandler));
app.get('/profile', verifyToken, wrapApi(getProfileHandler));
app.use(errorHandler); // 包括的エラーハンドリングはすべてのルートよりもあとに use する必要がある

app.listen(process.env.PORT || 3000, () => {
  console.log('Express listening on port ' + (process.env.PORT || 3000));
});
