import PersistantObject from "./PersistantObject";
import PersistedObject from "./PersistedObject";

export interface IUser {
  firstName: string
  lastName: string;
  email: string
}

export interface IUserModel extends IUser, PersistantObject {}

export interface IUserModelCreated extends IUser, PersistedObject {}