import { User } from '@database/entities/User';
import { EntityCaseNamingStrategy } from '@mikro-orm/core';
import { IS_DEV } from '@server/config';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

export default {
  // ./dist/server/database/entities
  //TODO: Do I need BaseEntity here as well?
  entities: [User], // path to your JS entities (dist), relative to `baseDir`
  dbName: 'jamescollins',
  user: 'jamescollins',
  password: '',
  type: 'postgresql',
  debug: IS_DEV,
  // Keep the case of things as they are defined in ts land
  namingStrategy: EntityCaseNamingStrategy,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
