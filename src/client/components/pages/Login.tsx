import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import { CircularProgress } from '@material-ui/core';
import { useLoginMutation } from '@client/generated/graphql';
import { toErrorMap } from '@client/utils/toErrorMap';
import { useHistory, Link as RouterLink } from "react-router-dom";
import ValidationService from '@shared/validation/ValidationService';

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
}));

const validationService = new ValidationService();
const validationSchema = validationService.loginSchema;

interface registerProps {}

const Login: React.FC<registerProps> = () => {
  const classes = useStyles();
  const history = useHistory();

  const [, login] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: 'jbccollins@gmail.com',
      password: 'BookFlyVehicleGreen2865',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await login({ options: values });
      if (response.data?.loginUser.errors) {
        setErrors(toErrorMap(response.data.loginUser.errors));
      } else if(response.data?.loginUser.user) {
        // Go back to home page on success
        history.push("/");
      }
    },
  });

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {formik.isSubmitting && <CircularProgress size={50} className={classes.loadingSpinner} />}
        <Typography component='h1' variant='h5'>
          Log in
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
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
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
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
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            Log in
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link component={RouterLink} to="/register">
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export { Login };
