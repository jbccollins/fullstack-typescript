import 'module-alias/register';
import seedUserTable from '@server/setup/database-seed/seedUserTable';
import chalk from 'chalk';
import { ORM } from '@server/database/orm/ORM';

const main = async () => {
  console.log(chalk.green(`>>>>> Starting database population`));
  await ORM.getInstance();
  await seedUserTable();
  console.log(chalk.green(`>>>>> Finished database population`));
  process.exit();
};
main();
