// noinspection JSUnusedLocalSymbols

import { NextFunction, Request, Response } from 'express';

import { BadRequestError, UnauthorizedError, UserNotFoundError } from '~/types/errors';

// 包括的エラーハンドリング。未使用引数も明記する必要があるためもろもろ抑制 (こことファイル先頭)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof UnauthorizedError || err instanceof BadRequestError || err instanceof UserNotFoundError) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send('Internal server error');
  }
};
