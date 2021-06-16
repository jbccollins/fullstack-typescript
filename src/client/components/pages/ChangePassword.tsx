import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import { CircularProgress } from '@material-ui/core';
import { FieldError, useChangePasswordMutation, useForgotPasswordMutation } from '@client/generated/graphql';
import { toErrorMap } from '@client/utils/toErrorMap';
import ValidationService from '@shared/validation/ValidationService';
import PasswordIcon from '@material-ui/icons/VpnKey';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loadingSpinner: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: 3,
    //left: -6,
    zIndex: 1,
  },
  success: {
    marginTop: theme.spacing(3),
  },
  tokenError: {
    marginTop: theme.spacing(2),
  },
}));

const validationService = new ValidationService();
const changePasswordValidationSchema = validationService.resetPasswordSchema;
const sendChangePasswordEmailValidationSchema = validationService.sendResetEmailSchema;

type ChangePasswordParams = {
  token: string;
};

export const ChangePassword: React.FC = () => {
  const { token } = useParams<ChangePasswordParams>();
  const classes = useStyles();

  const [, forgotPassord] = useForgotPasswordMutation();
  const [, changePassword] = useChangePasswordMutation();

  const [changePasswordEmailSent, setChangePassswordEmailSent] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [tokenErrors, setTokenErrors] = useState<FieldError[]>([]);

  const changePasswordFormik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await changePassword({ ...values, token });
      if (response.data?.changePassword.errors) {
        setErrors(toErrorMap(response.data.changePassword.errors));
        const tokenErrors = response.data.changePassword.errors.filter((e) => e.field === 'token');
        setTokenErrors(tokenErrors);
        console.log(tokenErrors);
        /*
          tokenErrors.forEach(e => {
            alert(e.message);
          })
        */
      } else if (response.data?.changePassword.user) {
        setPasswordChanged(true);
      }
    },
  });

  const sendChangePasswordEmailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: sendChangePasswordEmailValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await forgotPassord(values);
      if (response.data?.forgotPassword.errors) {
        setErrors(toErrorMap(response.data.forgotPassword.errors));
      } else if (response.data?.forgotPassword.user) {
        setChangePassswordEmailSent(true);
      }
    },
  });

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PasswordIcon />
        </Avatar>
        {changePasswordFormik.isSubmitting && <CircularProgress size={50} className={classes.loadingSpinner} />}
        <Typography component='h1' variant='h5'>
          Change Password
        </Typography>
        {tokenErrors.length > 0 && (
          <Grid container spacing={2} className={classes.tokenError}>
            {tokenErrors.map((e) => (
              <Grid item xs={12} key={e.message}>
                <Alert variant='outlined' severity='error'>
                  {e.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        )}
        {!token && changePasswordEmailSent && (
          <Typography className={classes.success} component='h1' variant='h6'>
            An email containing a link to change your password has been sent.
          </Typography>
        )}
        {!token && !changePasswordEmailSent && (
          <form className={classes.form} onSubmit={sendChangePasswordEmailFormik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  //required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  autoFocus={true}
                  value={sendChangePasswordEmailFormik.values.email}
                  onChange={sendChangePasswordEmailFormik.handleChange}
                  error={
                    sendChangePasswordEmailFormik.touched.email && Boolean(sendChangePasswordEmailFormik.errors.email)
                  }
                  helperText={sendChangePasswordEmailFormik.touched.email && sendChangePasswordEmailFormik.errors.email}
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
              Send Change Password Link
            </Button>
          </form>
        )}
        {token && passwordChanged && (
          <Typography className={classes.success} component='h1' variant='h6'>
            Your password has been changed.
          </Typography>
        )}
        {token && !passwordChanged && (
          <form className={classes.form} onSubmit={changePasswordFormik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  //required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  value={changePasswordFormik.values.password}
                  onChange={changePasswordFormik.handleChange}
                  error={changePasswordFormik.touched.password && Boolean(changePasswordFormik.errors.password)}
                  helperText={changePasswordFormik.touched.password && changePasswordFormik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  //required
                  fullWidth
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  id='password'
                  //autoComplete={false}
                  value={changePasswordFormik.values.confirmPassword}
                  onChange={changePasswordFormik.handleChange}
                  error={
                    changePasswordFormik.touched.confirmPassword && Boolean(changePasswordFormik.errors.confirmPassword)
                  }
                  helperText={
                    changePasswordFormik.touched.confirmPassword && changePasswordFormik.errors.confirmPassword
                  }
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
              Change Password
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
};
