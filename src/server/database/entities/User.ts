import { Entity, Property, Unique } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { PersistentEntity } from "@database/entities/PersistentEntity";
import { IUserEntity } from "@database/entities/IUserEntity";

@ObjectType()
@Entity()
export class User extends PersistentEntity implements IUserEntity {
  @Field(() => String)
  @Property({columnType: 'text', nullable: false})
  firstName!: string;

  @Field(() => String)
  @Property({columnType: 'text', nullable: false})
  lastName!: string;

  @Field(() => String)
  @Unique()
  @Property({columnType: 'text', nullable: false })
  email!: string;

  // Hide the pwdHash from graphql queries by omitting the @Field decorator
  @Property({columnType: 'text', nullable: false})
  pwdHash!: string;
}