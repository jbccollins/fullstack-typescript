import { IUserPersisted } from '@shared/models/User';

export const users: IUserPersisted[] = [
  {
    id: 1,
    email: 'GilAmran@gmail.com',
    firstName: 'Gil',
    lastName: 'Amran',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'NoaTevel@gmail.com',
    firstName: 'Noa',
    lastName: 'Tevel',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    email: 'JohnDoe@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function getUserById(userId: string): IUserPersisted {
  return users.find((u) => u.id.toString() === userId);
}
