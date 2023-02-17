import cors from 'cors';
import express from 'express';
import { pinoHttp as pino } from 'pino-http';

import { login, getUser, refreshAccessToken, UnauthorizedError } from './handlers/auth';
import { createUser, deleteUser, getUsers, updateUser } from './handlers/users';
import { verifyToken } from './middlewares/verifyToken';

const app = express();

// TODO: ルーティングの整理
// TODO: ハンドラの前に req 挟まないなにか欲しくない？
// TODO: 各ルートでのパラメータチェック

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

app.post('/auth/login', async (req, res) => {
  try {
    const userWithToken = await login(req);
    res.status(200).json(userWithToken);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      res.status(401).send(err.message);
    }
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.get('/auth/user', verifyToken, async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await getUser(req.uid);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.post('/auth/token-refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const token = await refreshAccessToken(refreshToken);
    res.status(200).json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.post('/user', async (req, res) => {
  try {
    const user = await createUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.put('/user/:id', verifyToken, async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (req.params.id !== req.uid) {
      res.status(403).send('Forbidden');
    }
    const user = await updateUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (req.params.id !== req.uid) {
      res.status(403).send('Forbidden');
    }
    const user = await deleteUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express listening on port ' + (process.env.PORT || 3000));
});
