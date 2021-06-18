import { executeQuery } from './common';
import hashPassword from '@server/auth/hashPassword';

const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  plaintextPassword: string
): Promise<any> => {
  const hashedPassword = await hashPassword(plaintextPassword);

  /*
    The 'RETURNING id' part of this allows us to immediately create a session for this user.
    The 'ON CONFLICT' part of this allows us to gracefully handle the case where someone attempts to create an account
    using an email that has already been used to sign up for an account.
  */
  const sql = `
    INSERT INTO user (first_name, last_name, email, password)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
    RETURNING id;`;
  const queryResults = await executeQuery(sql, [firstName, lastName, email, hashedPassword]);
  return queryResults;
};

const getUserByEmail = async (email: string): Promise<any> => {
  const sql = `SELECT * FROM user WHERE email = $1`;
  const queryResults = await executeQuery(sql, [email]);
  return queryResults;
};

export { getUserByEmail, registerUser };
