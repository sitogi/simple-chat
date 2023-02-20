import { NextFunction, Request, Response } from 'express';

export function wrapApi<T>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: T = await fn(req, res, next);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
