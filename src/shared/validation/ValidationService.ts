import * as yup from 'yup';

const minPasswordError = ' must be at least 8 characters long';
export default class ValidationService {
  private firstName = yup.string().required('First Name is required');
  private lastName = yup.string().required('Last Name is required');
  private email = yup.string().email('Enter a valid email').required('Email Address is required');
  private password = yup.string().required('Password is required');
  private createPassword = yup.string().min(8, `Password ${minPasswordError}`).required('Password is required');
  private confirmPassword = yup
    .string()
    .min(8, `Confirm Password ${minPasswordError}`)
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required');

  public readonly registerSchema = yup.object({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.createPassword,
    confirmPassword: this.confirmPassword,
  });

  public readonly loginSchema = yup.object({
    email: this.email,
    password: this.password,
  });

  public readonly resetPasswordSchema = yup.object({
    password: this.createPassword,
    confirmPassword: this.confirmPassword,
  });

  public readonly sendResetEmailSchema = yup.object({
    email: this.email,
  });
}
