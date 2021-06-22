import { IUserEntity } from '@server/database/entities/IUserEntity';
import { User } from '@server/database/entities/User';
import argon2 from 'argon2';

const main = async (): Promise<void> => {
  // Truncate the user table
  await User.delete({});

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
  const user = User.create(userEntity);
  await user.save();
};

export default main;
