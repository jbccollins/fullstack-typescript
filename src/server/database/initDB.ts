import { Connection, EntityCaseNamingStrategy, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { IS_DEV } from '@server/config';
import chalk from 'chalk';
import { Sequelize } from 'sequelize-typescript';
import { User } from './entities/User';

export const initDB = async (): Promise<Sequelize> => {
  try {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      database: 'jamescollins',
      password: '',
      models: [__dirname + '/models'],
      logging: true, //(...msg) => console.log(msg), //TODO: add better logging
      // define: {
      //   timestamps: false //TODO: add timestamps. But this seems to work by default....
      // }
    });
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({
      //alter: true // Alter tables to modify/add/delete columns to match the defined models. This has bad behavior for models with unique: true
      //force: true // Drop tables and recreate them to match the defined models
    });
    //await test();
    console.log('Database has been synced');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export const initDBMikro = async (): Promise<MikroORM<IDatabaseDriver<Connection>>> => {
  try {
    const orm = await MikroORM.init({
      // ../../../dist/server/database/entities
      entities: [User], // path to your JS entities (dist), relative to `baseDir`
      dbName: 'jamescollins',
      user: 'jamescollins',
      password: '',
      type: 'postgresql',
      debug: IS_DEV,
      // Keep the case of things as they are defined in ts land
      namingStrategy: EntityCaseNamingStrategy,
    });

    return orm;
  } catch (error) {
    // TODO: Check that this chalk logging works
    console.error(chalk.red('>>>>> Unable to connect to the database: <<<<<', error));
  }
}