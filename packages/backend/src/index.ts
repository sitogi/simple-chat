import express from 'express';
import { pinoHttp as pino } from 'pino-http';

import { createUser, deleteUser, getUser, getUsers, updateUser } from './handlers/users';

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
app.use(express.urlencoded({ extended: true }));

// ❯ http POST localhost:3000/user name=new-user email=new@example.com
app.post('/user', async (req, res) => {
  try {
    const user = await createUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

// ❯ http localhost:3000/users
app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

// ❯ http localhost:3000/user/1
app.get('/user/:id', async (req, res) => {
  try {
    const user = await getUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

// ❯ http PUT localhost:3000/user/4 name=new-user-updated email=new@example.com
app.put('/user/:id', async (req, res) => {
  try {
    const user = await updateUser(req);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('internal error');
  }
});

// ❯ http DELETE localhost:3000/user/4
app.delete('/user/:id', async (req, res) => {
  try {
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
