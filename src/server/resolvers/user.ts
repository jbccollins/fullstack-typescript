import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '@server/database/entities/User';
import { MyContext } from './types';
import { IUserEntity } from '@server/database/entities/IUserEntity';
import { isAuth } from '@server/auth/authChecker';
import { logger } from '@server/middleware/logger';
import { SESSION_COOKIE_NAME } from '@server/config';
import hashPassword from '@server/auth/hashPassword';
import validatePassword from '@server/auth/validatePassword';
import sendEmail, {
  changePasswordSuccess,
  forgotPasswordEmailBodyTemplate,
  formatEmailTemplate,
} from '@server/utils/sendEmail';
import { v4 as uuid } from 'uuid';
import { FORGOT_PASSWORD_PREFIX } from '@server/constants/redis';
import { FieldError } from './fieldError';

@InputType()
class EmailPasswordInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

const nonExistantUserError: UserResponse = {
  errors: [{ field: 'email', message: 'A user with that email does not exist' }],
};

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Arg('confirmPassword') confirmPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];
    if (confirmPassword != password) {
      errors.push({
        field: 'password',
        message: 'Passwords must match',
      });
    }
    if (password.length === 0) {
      errors.push({
        field: 'password',
        message: 'password field is required',
      });
    }
    if (confirmPassword.length === 0) {
      errors.push({
        field: 'confirmPassword',
        message: 'confirmPassword field is required',
      });
    }
    if (token.length === 0) {
      errors.push({
        field: 'token',
        message: 'token field is required',
      });
    }
    if (errors.length > 0) {
      return { errors };
    }
    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired or invalid',
          },
        ],
      };
    }

    const user = await User.findOne(parseInt(userId));
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }

    user.pwdHash = await hashPassword(password);
    await user.save();
    // Ensure that the token is only good for a single password change
    await redis.del(key);
    await sendEmail(user.email, formatEmailTemplate({}, changePasswordSuccess));

    // log in the user after they reset their password
    req.session.userId = user.id;

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User> {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    return await User.findOne({ id: req.session.userId });
  }

  // Example Query:
  // users {
  //   id,
  //   firstName,
  //   lastName,
  // }
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => UserResponse)
  async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: MyContext): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });
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
  user(@Arg('id') id: number): Promise<User | undefined> {
    return User.findOne(id);
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
    @Arg('confirmPassword', () => String) confirmPassword: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];
    if (confirmPassword != password) {
      errors.push({
        field: 'password',
        message: 'Passwords must match',
      });
    }
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
      // const result = (await ORM.getInstance())
      //   .createQueryBuilder()
      //   .insert()
      //   .into(User)
      //   .values(userEntity)
      //   //.onConflict('email')
      //   .returning('*')
      //   .execute();
      // TODO: Consider doing this with a try catch check using native sql with ON CONFLICT and RETURNING id
      // TODO: Check that the unique constraint stuff here still works
      user = await User.create(userEntity).save();
    } catch (e) {
      console.error('>>>>>>>>>>>>>>> ERRORRRR');
      console.error(e);
      // https://www.postgresql.org/docs/9.2/errcodes-appendix.html
      // unique constraint violation code
      if (e.code === '23505') {
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: options.email } });
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
  async logoutUser(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          // TODO: Add actual logging here
          console.log(err);
          resolve(false);
          return;
        }
        // TODO: Pull the 'qid' variable out into a constants file
        res.clearCookie(SESSION_COOKIE_NAME);
        resolve(true);
      })
    );
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
    @Ctx() {}: MyContext
  ): Promise<User | null> {
    const user = await User.findOne(id);
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
    await user.save();
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
  async deleteUser(@Arg('id', () => Int) id: number): Promise<boolean> {
    const user = await User.findOne(id);
    if (user === null) {
      // TODO: Log this exception in a sensible way and update the return type(s)
      // reflect that this exception can be gracefully caught. Something like <Boolean | null>
      console.error(`User with ID ${id} does not exist.`);
      return false;
    }
    await user.remove();
    return true;
  }
}
