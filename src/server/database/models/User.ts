import { Table, Column, Model, AllowNull } from 'sequelize-typescript';
import { IUserModel } from '@shared/models/User'; 
@Table({
  tableName: 'User',
})
export default class User extends Model implements IUserModel
{
  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  pwdHash: string;
}

export { User };