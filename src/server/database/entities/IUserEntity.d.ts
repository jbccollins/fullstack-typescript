import { IUserPersistent } from '@shared/models/User';

export interface IUserEntity extends IUserPersistent {
  pwdHash: string;
}
