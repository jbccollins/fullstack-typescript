import { createConnection } from 'typeorm';
import { DB_NAME, DB_PASSWORD, DB_USER, DB_DIALECT } from '@server/config';
import { User } from '@server/database/entities/User';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const namingStrategy = new SnakeNamingStrategy();
export default {
  type: DB_DIALECT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: true,
  entities: [User],
  namingStrategy,
  migrationsTableName: 'migration',

  // We are using migrations, synchronize should be set to false.
  synchronize: false, // create tables automatically

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/server/database/orm/migrations',
    //migrationsDir: path.join(__dirname, './migrations'),
  },
} as Parameters<typeof createConnection>[0];
