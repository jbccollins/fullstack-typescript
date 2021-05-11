import { IUserPersistant } from "@shared/models/User";

export interface IUserEntity extends IUserPersistant {
  pwdHash: string;
}