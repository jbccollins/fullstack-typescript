import 'module-alias/register';
import populateUserTable from '@server/setup/database-population/populateUserTable';
import chalk from 'chalk';

const main = async () => {
  console.log(chalk.green(`>>>>> Starting database population`));
  await populateUserTable();
  console.log(chalk.green(`>>>>> Finished database population`));
  process.exit();
};
main();
