import { isAuth } from '@server/auth/authChecker';
import { Post } from '@server/database/entities/Post';
import { Arg, Field, Query, Resolver, InputType, Ctx, Mutation, UseMiddleware, ObjectType } from 'type-graphql';
import { FieldError } from './fieldError';
import { MyContext } from './types';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => Post, { nullable: true })
  post?: Post;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post)
  async post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => PostResponse)
  async createPost(@Arg('input') input: PostInput, @Ctx() { req }: MyContext): Promise<PostResponse> {
    const post = await Post.create({ ...input, authorId: req.session.userId }).save();
    return { post };
  }
}
