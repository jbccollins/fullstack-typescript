import IPersistantObject from '@shared/models/IPersistantObject';
import IPersistedObject from '@shared/models/IPersistedObject';
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUserPersistant extends IUser, IPersistantObject {}

export interface IUserPersisted extends IUser, IPersistedObject {}