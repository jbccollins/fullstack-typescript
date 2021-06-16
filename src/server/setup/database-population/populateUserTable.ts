import { IUserEntity } from '@database/entities/IUserEntity';
import { User } from '@database/entities/User';
import { CustomEntityManager } from '@database/helpers/CustomEntityManager';
import argon2 from 'argon2';
import { ORM } from '@database/orm/ORM';

const main = async (): Promise<void> => {
  // Truncate the user table
  (await ORM.getInstance()).em.nativeDelete(User, {});

  // Insert a user
  const firstName = 'James',
    lastName = 'Collins',
    email = 'jbccollins@gmail.com',
    password = 'BookFlyVehicleGreen2865';
  const pwdHash = await argon2.hash(password);
  const userEntity: IUserEntity = {
    firstName,
    lastName,
    email,
    pwdHash,
  };
  await CustomEntityManager.createAndSave(User, userEntity);
};

export default main;
