import hashPassword from '@server/auth/hashPassword';
import validatePassword from '@server/auth/validatePassword';
test('Hashing and validating a password works', async () => {
  const password = 'alkjhdsflkaj;oaieurt03-4958a;lkhjg09u4t';
  const hash = await hashPassword(password);
  const valid = await validatePassword(hash, password);
  return expect(valid).toBe(true);
});
