/*
A simple CRUD interface for Users that integrates sequelize, postgresql and typescript.
*/
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '@database/models/User';
import { MyContext } from './types';
import argon2 from 'argon2';

@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]
  @Field(() => User, {nullable: true})
  user?: User
}

@Resolver()
export class UserResolver {
  // Example Query:
  // users {
  //   id,
  //   firstName,
  //   lastName,
  // }
  @Query(() => [User])
  users(@Ctx() ctx: MyContext): Promise<User[]> {
    return User.findAll();
  }

  // Example Query:
  // user(id: 40) {
  //   firstName,
  //   lastName,
  // }
  @Query(() => User, { nullable: true })
  user(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<User | null> {
    return User.findOne({ where: { id: id } });
  }
  /*
    Example Query:
    mutation {
      registerUser(
        firstName: "Cory",
        lastName: "Booker",
        password: "my_password",
        email: "corybooker123@gmail.com"
      ) {
        firstName,
        lastName
      }
    }
  */
  @Mutation(() => User)
  async registerUser(
    @Arg('firstName', () => String) firstName: string,
    @Arg('lastName', () => String) lastName: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User> {
    const pwdHash = await argon2.hash(password);
    const user = new User({
      firstName,
      lastName,
      email,
      pwdHash,
    });
    await user.save();
    return user;
  }


  /*
  Example Query
  mutation {
    loginUser(
      options: { email: "corybooker1234@gmail.com", password: "my_password" }
    ) {
      errors {
        field
        message
      }
      user {
        id
        email
      }
    }
  }
  */
  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("options", () => EmailPasswordInput) options: EmailPasswordInput,
    @Ctx() ctx: MyContext,
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email : options.email }});
    if (!user) {
      return  {
        errors: [{field: 'email', message: 'A user with that email does not exist'}]
      }
    }
    const valid = await argon2.verify(user.pwdHash, options.password);
    if (!valid) {
      return  {
        errors: [{field: 'password', message: 'Incorrect password'}]
      }
    }
    return {
      user
    };
  }


  //Example Query
  // mutation {
  //   updateUser(
  //     id: 99,
  //     firstName: "Cory",
  //     lastName: "Builder",
  //   ) {
  //     firstName,
  //     lastName
  //   }
  // }
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg('id', () => Int) id: number,
    @Arg('firstName', () => String, { nullable : true }) firstName: string,
    @Arg('lastName', () => String, { nullable : true }) lastName: string,
    @Arg('email', () => String, { nullable : true }) email: string,
    @Arg('pwdHash', () => String, { nullable : true }) pwdHash: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const user: User = await User.findOne({where: { id: id }});
    if (user === null) {
      // TODO: Log this exception in a sensible way and update the return type(s)
      // reflect that this exception can be gracefully caught. Something like <User | null>
      console.error(`User with ID ${id} does not exist.`)
      return null;
    }
    if (typeof firstName !== 'undefined') {
      user.firstName = firstName;
    }
    if (typeof lastName !== 'undefined') {
      user.lastName = lastName;
    }
    if (typeof email !== 'undefined') {
      user.email = email;
    }
    if (typeof pwdHash !== 'undefined') {
      user.pwdHash = pwdHash;
    }
    await user.save();
    return user;
  }

  // Example Query
  // mutation {
  //   deletePost(
  //     id: 40,
  //   )
  // }
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() ctx: MyContext,
  ): Promise<Boolean> {
    const user: User = await User.findOne({where: { id: id }});
    if (user === null) {
      // TODO: Log this exception in a sensible way and update the return type(s)
      // reflect that this exception can be gracefully caught. Something like <Boolean | null>
      console.error(`User with ID ${id} does not exist.`)
      return false;
    }
    user.destroy();
    return true;
  }

}


