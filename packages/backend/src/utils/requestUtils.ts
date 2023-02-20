import { Request } from 'express';

// REVISIT: 本当は自身で拡張するのが正解っぽい
// see: https://blog.logrocket.com/extend-express-request-object-typescript/

export function setUidToRequest(req: Request, uid: string): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.uid = uid;
}

export function getUidFromRequest(req: Request): string {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return req.uid;
}
