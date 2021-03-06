import { executeQuery } from '@server/database/queries/common';
import getIn from '@shared/utils/getIn';
import chalk from 'chalk';

const sanitize = (i: unknown): unknown => {
  let toReturn = i;
  if (typeof i === 'string') {
    toReturn = i.replace("'", "''");
  } else if (typeof i === 'object') {
    toReturn = sanitize(JSON.stringify(i));
  }
  if (toReturn === 'null' || toReturn === 'undefined' || typeof toReturn === 'undefined') {
    toReturn = null;
  }
  return toReturn;
};

const defaultTransformer = (path: unknown): unknown => {
  const pth = Array.isArray(path) ? path : [path];
  return (item: unknown) => {
    return getIn(item, pth);
  };
};

const truncateTable = (table: string): void => {
  executeQuery(`TRUNCATE ${table}`);
};

const _generateTablePopulationSql = (table: string, items: unknown[], transformation: unknown): string => {
  const columns = Object.keys(transformation);
  let sql = `INSERT INTO ${table} ("${columns.join('", "')}") VALUES `;
  const values = items.map(
    (item: unknown) =>
      `('${columns
        .map((c) => {
          return sanitize(transformation[c](item));
        })
        .join("', '")}')`
  );
  sql = sql + values.join(', ');
  // TODO: This is kinda fragile...
  sql = sql.replace(/, ''/g, ', null');
  return sql;
};

const destructivelyPopulateTable = (table: string, items: unknown[], transformation: unknown): void => {
  console.log(chalk.yellow(`Destructively populating '${table}' table...`));
  const sql = `TRUNCATE ${table}; ${_generateTablePopulationSql(table, items, transformation)}`;
  executeQuery(sql);
  console.log(chalk.green(`Done.`));
};

const populateTable = (table: string, items: unknown[], transformation: unknown): void => {
  console.log(chalk.yellow(`Populating '${table}' table...`));
  const sql = _generateTablePopulationSql(table, items, transformation);
  executeQuery(sql);
  console.log(chalk.green(`Done.`));
};

export { sanitize, populateTable, destructivelyPopulateTable, defaultTransformer, truncateTable };
