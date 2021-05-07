import 'module-alias/register';
import express from 'express';
import path from 'path';
import { apiRouter } from '@routes/api-router';
import { pagesRouter } from '@routes/pages-router';
import { staticsRouter } from '@routes/statics-router';
import { initDB } from '@database/initDB';
import User from '@database/models/User';
import * as config from './config';

console.log(`*******************************************`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);
console.log(`*******************************************`);

const app = express();
app.set('view engine', 'ejs');

app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(apiRouter());
app.use(staticsRouter());
app.use(pagesRouter());

initDB();

const test = async () => {
  const user = new User({
    firstName: 'Haha',
    lastName: 'Collins',
    email: 'derp2@gmail.com',
    pwdHash: 'asdfffjjfjf',
  });
  user.email = 'bert@GMAIL.COM';
  await user.save();
  console.log(user.id, user.firstName, user.lastName);
};

//test();

app.listen(config.SERVER_PORT, () => {
  console.log(`App listening on port ${config.SERVER_PORT}!`);
});
