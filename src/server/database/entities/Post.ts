import { Field, ObjectType } from 'type-graphql';
import { PersistentEntity } from '@server/database/entities/PersistentEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '@server/database/entities/User';
import { IPostPersistent } from '@shared/models/IPost';

@ObjectType()
@Entity()
export class Post extends PersistentEntity implements IPostPersistent {
  @Field(() => String)
  @Column({ nullable: false })
  title!: string;

  @Field(() => String)
  @Column({ nullable: false })
  text!: string;

  @Field(() => Number)
  @Column({ nullable: false, default: 0, type: 'int' })
  points!: number;

  @Field()
  @Column()
  authorId!: number;

  @ManyToOne(() => User, (user) => user.posts)
  author!: User;
}
