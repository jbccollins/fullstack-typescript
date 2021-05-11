import { Table, Column, Model, AllowNull, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { IUserPersistant } from '@shared/models/User';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Table({
  tableName: 'User',
})
export default class User extends Model implements IUserPersistant {
  @Field(() => String)
  @AllowNull(false)
  @Column({type: 'text'})
  firstName: string;

  @Field(() => String)
  @AllowNull(false)
  @Column({type: 'text'})
  lastName: string;

  @Field(() => String)
  @AllowNull(false)
  @Column({type: 'text', unique: "UserEmail"})
  email: string;

  // Hide the pwdHash from graphql queries by omitting the @Field decorator
  @AllowNull(false)
  @Column({type: 'text'})
  pwdHash: string;

  // Only need to explicitly put the id, createdAt and updatedAt definitions in here so we can
  // decorate them for type-graphql. Sequelize will create these under the hood if we don't
  // explicitly define them but then graphql can't see them.
  @Field(() => String)
  @AllowNull(false)
  @Column
  createdAt: Date;

  @Field(() => String)
  @AllowNull(false)
  @Column
  updatedAt: Date;

  @Field(() => Int)
  @AllowNull(false)
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;
}

export { User };
