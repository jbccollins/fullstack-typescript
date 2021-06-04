import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { SessionData, Session } from 'express-session';

export type MyContext = {
  orm: MikroORM<IDatabaseDriver<Connection>>;
  req: Request & { session: Session & Partial<SessionData> & { userId?: number } };
  res: Response;
};