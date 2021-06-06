import { Connection, EntityCaseNamingStrategy, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import chalk from 'chalk';
import config from '@database/orm/mikro-orm.config';

// Singleton
export class ORM {
  private static instance: MikroORM<IDatabaseDriver<Connection>> = null;

  // Private constructor ensures a singleton class
  private constructor() {}

  private static async initialize(): Promise<void> {
    if (this.instance !== null) {
      return;
    }
    try {
      const orm = await MikroORM.init(config);
      this.instance = orm;
      return;
    } catch (error) {
      // TODO: Check that this chalk logging works
      console.error(chalk.red('>>>>> Unable to connect to the database: <<<<<', error));
    }
  }

  static async getInstance(): Promise<MikroORM<IDatabaseDriver<Connection>>> {
    if (!this.instance) {
      await this.initialize();
    }

    return this.instance;
  }
}

// export const initDBMikro = async (): Promise<MikroORM<IDatabaseDriver<Connection>>> => {
//   try {
//     const orm = await MikroORM.init({
//       // ../../../dist/server/database/entities
//       entities: [User], // path to your JS entities (dist), relative to `baseDir`
//       dbName: 'jamescollins',
//       user: 'jamescollins',
//       password: '',
//       type: 'postgresql',
//       debug: IS_DEV,
//       // Keep the case of things as they are defined in ts land
//       namingStrategy: EntityCaseNamingStrategy,
//     });

//     return orm;
//   } catch (error) {
//     // TODO: Check that this chalk logging works
//     console.error(chalk.red('>>>>> Unable to connect to the database: <<<<<', error));
//   }
// }
