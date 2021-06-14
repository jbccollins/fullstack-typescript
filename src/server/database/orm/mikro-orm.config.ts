import { User } from '@database/entities/User';
import { EntityCaseNamingStrategy } from '@mikro-orm/core';
import { IS_DEV, DB_NAME, DB_PASSWORD, DB_USER, DB_DIALECT } from '@server/config';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

export default {
  // ./dist/server/database/entities
  //TODO: Do I need BaseEntity here as well?
  entities: [User], // path to your JS entities (dist), relative to `baseDir`
  dbName: DB_NAME,//'jamescollins',
  user: DB_USER, //'jamescollins',
  password: DB_PASSWORD, //'',
  type: DB_DIALECT, //'postgresql',
  debug: IS_DEV,
  // Keep the case of things as they are defined in ts land
  //namingStrategy: EntityCaseNamingStrategy,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
