import { Client } from 'pg';
import * as config from '@server/config';

const DEV_CONNECTION_OPTIONS = {
  database: config.DB_NAME,
};

const PRODUCTION_CONNECTION_OPTIONS = {
  connectionString: "postgres://htiasfxoxxvawb:kjhdsfsjdhf@ec2-23-23-184-76.compute-1.amazonaws.com:5432/d5ierv6dkg5jaq",
}

const OPTIONS = process.env.NODE_ENV === "production" ? PRODUCTION_CONNECTION_OPTIONS : DEV_CONNECTION_OPTIONS;

const executeQuery = async (sql: string, params=[], options=OPTIONS) => {
  try {
    const client = new Client(options)
    await client.connect()
    const res = await client.query(sql, params)
    await client.end()
    return ({success: true, rows: res.rows});
  } catch (e) {
    console.log(">>>>>>>>ERROR<<<<<<<<<")
    console.log(e);
    // console.log(">>>>>>>>>SQL<<<<<<<<<<")
    // console.log(sql);
    return ({
      //error: e
      error: true
    });
  }
};

export {
  executeQuery,
};