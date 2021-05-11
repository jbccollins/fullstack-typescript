import { Entity, Property, Unique } from "@mikro-orm/core";
import { Field } from "type-graphql";
import { BaseEntity } from "@database/entities/BaseEntity";
import { IUserEntity } from "./IUserEntity";

@Entity()
export class User extends BaseEntity implements IUserEntity {
  @Field(() => String)
  @Property({type: 'text', nullable: false})
  firstName!: string;

  @Field(() => String)
  @Property({type: 'text', nullable: false})
  lastName!: string;

  @Field(() => String)
  @Unique()
  @Property({type: 'text', nullable: false, unique: true})
  email!: string;

  // Hide the pwdHash from graphql queries by omitting the @Field decorator
  @Property({type: 'text', nullable: false})
  pwdHash!: string;
}