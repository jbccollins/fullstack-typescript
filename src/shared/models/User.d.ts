import IPersistentObject from '@shared/models/IPersistentObject';
import IPersistedObject from '@shared/models/IPersistedObject';
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserPersistent extends IUser, IPersistentObject {}

export interface IUserPersisted extends IUser, IPersistedObject {}
