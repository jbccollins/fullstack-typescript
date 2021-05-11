import { IUserPersisted } from '@shared/models/User';

export const getUserFullName = (user: IUserPersisted): string => `${user.firstName} ${user.lastName}`;
