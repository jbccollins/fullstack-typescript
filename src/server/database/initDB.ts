import { sequelize } from './sequelize';
export const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({
      // force: true
    });
    //await test();
    console.log('Database has been synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
