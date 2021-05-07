import { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'jamescollins',
  models: [__dirname + '/models'],
  logging: false, //(...msg) => console.log(msg), //TODO: add better logging
  // define: {
  //   timestamps: false //TODO: add timestamps
  // }
});
