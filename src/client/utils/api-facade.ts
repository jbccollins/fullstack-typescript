import axios from 'axios';
import { IUserPersisted } from '@shared/models/User';

export async function loadUsersAPI(): Promise<IUserPersisted[]> {
  const res = await axios.get(`/api/users`);
  return res.data as IUserPersisted[];
}
