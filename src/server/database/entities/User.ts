import { Field, ObjectType } from 'type-graphql';
import { PersistentEntity } from '@server/database/entities/PersistentEntity';
import { IUserEntity } from '@server/database/entities/IUserEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Post } from '@server/database/entities/Post';

@ObjectType()
@Entity()
export class User extends PersistentEntity implements IUserEntity {
  @Field(() => String)
  @Column({ nullable: false })
  firstName!: string;

  @Field(() => String)
  @Column({ nullable: false })
  lastName!: string;

  @Field(() => String)
  @Column({ nullable: false, unique: true })
  email!: string;

  @Field(() => String)
  @Column({ nullable: true })
  username: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  // Hide the pwdHash from graphql queries by omitting the @Field decorator
  @Column({ nullable: false })
  pwdHash!: string;

  @Field(() => String)
  public get name(): string {
    if (this.username) {
      return this.username;
    } else {
      return `${this.firstName} ${this.lastName}`;
    }
  }
}
