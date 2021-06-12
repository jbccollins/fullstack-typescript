import 'module-alias/register';
import 'reflect-metadata'; // Used by type-graphql
import express from 'express';
import path from 'path';
import { apiRouter } from '@routes/api-router';
import { pagesRouter } from '@routes/pages-router';
import { staticsRouter } from '@routes/statics-router';
import { ORM } from '@database/orm/ORM';
import { User } from '@database/entities/User';
import chalk from 'chalk';
import * as config from '@server/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from '@server/resolvers/hello';
import { UserResolver } from '@server/resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from '@server/resolvers/types';
import { authChecker } from '@server/auth/authChecker';
import cors from 'cors';
import { SESSION_COOKIE_NAME } from '@server/config';

const main = async (): Promise<void> => {
  try {
    console.log(`*******************************************`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`config: ${JSON.stringify(config, null, 2)}`);
    console.log(`*******************************************`);

    const orm = await ORM.getInstance();
    // Automatically run migrations:
    orm.getMigrator().up();

    const app = express();
    app.set('view engine', 'ejs');

    app.get('/hello', (_, res) => {
      res.send('hello');
    });

    // Globally apply cors to all routes:
    app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
    }));

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    app.use(
      session({
        name: SESSION_COOKIE_NAME,
        store: new RedisStore({
          client: redisClient,
          // Don't refresh the user session in dev
          disableTouch: config.IS_DEV,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          sameSite: 'lax',
          secure: !config.IS_DEV, // cookie only works in https
        },
        saveUninitialized: false,
        secret: process.env.REDIS_SECRET,
        resave: false,
      }),
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, UserResolver],
        validate: false, //TODO: Should this be false?
        authChecker,
      }),
      context: ({ req, res }): MyContext => ({ orm, req, res }),
    });

    // Create graphql endpoint http://localhost:3000/graphql
    apolloServer.applyMiddleware({ app, cors: false });

    //app.use;
    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    app.use(apiRouter());
    app.use(staticsRouter());
    app.use(pagesRouter());

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  } catch (e) {
    console.log(chalk.red(e));
  }
};

main();
