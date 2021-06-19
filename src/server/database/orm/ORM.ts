import chalk from 'chalk';
import config from '@server/database/orm/ormconfig';
import { createConnection, Connection } from 'typeorm';

// Singleton
export class ORM {
  private static instance: Connection = null;

  // Private constructor ensures a singleton class
  private constructor() {}

  private static async initialize(): Promise<void> {
    if (this.instance !== null) {
      return;
    }
    try {
      const orm = await createConnection(config);
      this.instance = orm;
      return;
    } catch (error) {
      // TODO: Check that this chalk logging works
      console.error(chalk.red('>>>>> Unable to connect to the database: <<<<<', error));
    }
  }

  static async getInstance(): Promise<Connection> {
    if (!this.instance) {
      await this.initialize();
    }

    return this.instance;
  }
}
