import argon2 from 'argon2';

const validatePassword = async (hashedPassword: string, plaintextPasssword: string): Promise<boolean> => {
  const valid = await argon2.verify(hashedPassword, plaintextPasssword);
  return valid;
};

export default validatePassword;
