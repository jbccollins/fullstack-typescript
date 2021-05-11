import 'module-alias/register';
import 'reflect-metadata'; // Used by type-graphql
import express from 'express';
import path from 'path';
import { apiRouter } from '@routes/api-router';
import { pagesRouter } from '@routes/pages-router';
import { staticsRouter } from '@routes/statics-router';
import { initDB, initDBMikro } from '@database/initDB';
import User from '@database/models/User';
import chalk from 'chalk';
import * as config from '@server/config';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { UserResolver } from './resolvers/user';
import { Sequelize } from 'sequelize-typescript';

const test = async () => {
  const user = new User({
    firstName: 'James',
    lastName: 'Collins',
    email: 'james@gmail.com',
    pwdHash: 'asdfffjjfjf',
  });
  await user.save();
  console.log(user.id, user.firstName, user.lastName);
};

const main = async (): Promise<void> => {
  try {
    console.log(`*******************************************`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`config: ${JSON.stringify(config, null, 2)}`);
    console.log(`*******************************************`);
    
    const sequelize: Sequelize = null;//await initDB();
    const orm = await initDBMikro();

    const app = express();
    app.set('view engine', 'ejs');

    app.get('/hello', (_, res) => {
      res.send('hello');
    });

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, UserResolver],
        validate: false, //TODO: Should this be false?
      }),
      context: () => ({ sequelize }),
    });

    // Create graphql endpoint http://localhost:3000/graphql
    apolloServer.applyMiddleware({ app });

    app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
    app.use(apiRouter());
    app.use(staticsRouter());
    app.use(pagesRouter());

    //await test();

    app.listen(config.SERVER_PORT, () => {
      console.log(`App listening on port ${config.SERVER_PORT}!`);
    });
  } catch (e) {
    console.log(chalk.red(e));
  }
};

main();
