import argon2 from 'argon2';
import 'module-alias';
const hashPassword = async (password: string): Promise<string> => {
  const pwdHash = await argon2.hash(password);
  return pwdHash;
};

export default hashPassword;
