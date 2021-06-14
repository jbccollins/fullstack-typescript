/*
A simple CRUD interface for Users that integrates mikroorm, type-grahql, postgresql and typescript.
*/
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { User } from '@database/entities/User';
import { MyContext } from './types';
import { IUserEntity } from '@database/entities/IUserEntity';
import { CustomEntityManager } from '@database/helpers/CustomEntityManager';
import { isAuth } from '@server/auth/authChecker';
import { logger } from '@server/middleware/logger';
import { SESSION_COOKIE_NAME } from '@server/config';
import sleep from '@shared/utils/sleep';
import hashPassword from '@server/auth/hashPassword';
import validatePassword from '@server/auth/validatePassword';
import sendEmail, { forgotPasswordEmailBodyTemplate, formatEmailTemplate } from '@server/utils/sendEmail';
import { v4 as uuid } from 'uuid';
import { FORGOT_PASSWORD_PREFIX } from '@server/constants/redis';

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
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

const nonExistantUserError: UserResponse = {errors: [{ field: 'email', message: 'A user with that email does not exist' }]};

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { orm, req }: MyContext): Promise<User> {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    return await orm.em.findOne(User, { id: req.session.userId });
  }

  // Example Query:
  // users {
  //   id,
  //   firstName,
  //   lastName,
  // }
  @Query(() => [User])
  async users(@Ctx() ctx: MyContext): Promise<User[]> {
    await sleep(2000);
    return ctx.orm.em.find(User, {});
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { orm, redis } : MyContext
  ) {
    const user = await orm.em.findOne(User, { email })
    if (!user) {
      return nonExistantUserError;
    }

    const token = uuid();
    await redis.set(FORGOT_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); // three days
    await sendEmail(user.email, formatEmailTemplate({ token }, forgotPasswordEmailBodyTemplate));
    return { user };
  }

  // Example Query:
  // user(id: 40) {
  //   firstName,
  //   lastName,
  // }
  @Query(() => User, { nullable: true })
  user(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<User | null> {
    //return User.findOne({ where: { id: id } });
    return ctx.orm.em.findOne(User, { id: id });
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
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('firstName', () => String) firstName: string,
    @Arg('lastName', () => String) lastName: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() { req, orm }: MyContext,
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];
    if (firstName.length === 0) {
      errors.push({
        field: 'firstName',
        message: 'firstName field is required',
      });
    }
    if (lastName.length === 0) {
      errors.push({
        field: 'lastName',
        message: 'lastName field is required',
      });
    }
    if (email.length === 0) {
      errors.push({
        field: 'email',
        message: 'email field is required',
      });
    }
    if (password.length === 0) {
      errors.push({
        field: 'password',
        message: 'password field is required',
      });
    }
    if (errors.length > 0) {
      return { errors };
    }
    const pwdHash = await hashPassword(password);
    const userEntity: IUserEntity = {
      firstName,
      lastName,
      email,
      pwdHash,
    };
    let user: User = null;
    try {
      // Alternate way to create a user using the query builder
      /*
      const result = await (orm.em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
        firstName,
        lastName,
        email,
        pwdHash,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning("*");
      user = result[0];
      */
      // TODO: Do this try catch check with native sql with ON CONFLICT and RETURNING id
      user = await CustomEntityManager.createAndSave(User, userEntity);
    } catch (e) {
      if (e.name === 'UniqueConstraintViolationException') {
        errors.push({
          field: 'email',
          message: 'A user with this email already exists.',
        });
      } else {
        errors.push({
          field: 'email',
          message: 'Failed to create user. Code: ' + e.code,
        });
      }
      return { errors };
    }

    // Store user id session. set a cookie on the user to keep them logged in
    req.session.userId = user.id;

    return { user };
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
    @Arg('options', () => EmailPasswordInput) options: EmailPasswordInput,
    @Ctx() { orm, req }: MyContext,
  ): Promise<UserResponse> {
    const user = await orm.em.findOne(User, { email: options.email });
    if (!user) {
      return nonExistantUserError;
    }
    const valid = await validatePassword(user.pwdHash, options.password);

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'Incorrect password' }],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  /*
  Example Query
  mutation {
    logoutUser
  }
  */
  //@Authorized()
  @UseMiddleware(isAuth, logger)
  @Mutation(() => Boolean)
  async logoutUser(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    
    return new Promise(resolve => req.session.destroy(err => {
      if(err) {
        // TODO: Add actual logging here
        console.log(err);
        resolve(false);
        return;
      }
      // TODO: Pull the 'qid' variable out into a constants file
      res.clearCookie(SESSION_COOKIE_NAME);
      resolve(true);
    }));

    return true;
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
    @Arg('firstName', () => String, { nullable: true }) firstName: string,
    @Arg('lastName', () => String, { nullable: true }) lastName: string,
    @Arg('email', () => String, { nullable: true }) email: string,
    @Arg('pwdHash', () => String, { nullable: true }) pwdHash: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const user: User = await ctx.orm.em.findOne(User, { id: id });
    if (user === null) {
      // TODO: Log this exception in a sensible way and update the return type(s)
      // reflect that this exception can be gracefully caught. Something like <User | null>
      console.error(`User with ID ${id} does not exist.`);
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
    await ctx.orm.em.persistAndFlush(user);
    return user;
  }

  // Example Query
  // mutation {
  //   deleteUser (
  //     id: 40,
  //   )
  // }
  @UseMiddleware(logger)
  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number, @Ctx() ctx: MyContext): Promise<boolean> {
    const user: User = await ctx.orm.em.findOne(User, { id: id });
    if (user === null) {
      // TODO: Log this exception in a sensible way and update the return type(s)
      // reflect that this exception can be gracefully caught. Something like <Boolean | null>
      console.error(`User with ID ${id} does not exist.`);
      return false;
    }
    ctx.orm.em.removeAndFlush(user);
    return true;
  }
}
