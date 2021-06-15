import dotenv from 'dotenv';
import findUp from 'find-up';
import path from 'path';
import fs from 'fs';

const IS_DEV = process.env.NODE_ENV !== 'production';
const SESSION_COOKIE_NAME = 'qid';

if (IS_DEV) {
  dotenv.config({ path: findUp.sync('.env') });
}

const packageJsonPath = path.join(process.cwd(), 'package.json');
const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
const PackageJson = JSON.parse(rawPackageJson);
const { version: VERSION } = PackageJson;

// server
const SERVER_PORT = process.env.PORT || 3000;
const WEBPACK_PORT = 8085; // For dev environment only

// database
const DB_NAME = process.env.DB_NAME,
  DB_USER = process.env.DB_USER,
  DB_PASSWORD = process.env.DB_PASSWORD,
  DB_HOST = process.env.DB_HOST,
  DB_DIALECT = process.env.DB_DIALECT;
export {
  IS_DEV,
  VERSION,
  SERVER_PORT,
  WEBPACK_PORT,
  SESSION_COOKIE_NAME,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
};
