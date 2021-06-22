import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import { CircularProgress } from '@material-ui/core';
import { useCreatePostMutation } from '@client/generated/graphql';
import { toErrorMap } from '@client/utils/toErrorMap';
import { useHistory } from 'react-router-dom';
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
const validationSchema = validationService.submitPostSchema;

const CreatePost: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const [, createPost] = useCreatePostMutation();

  const formik = useFormik({
    initialValues: {
      title: 'This is a post title',
      text: 'This is a post text',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await createPost({ input: values });
      if (response.data?.createPost.errors) {
        setErrors(toErrorMap(response.data.createPost.errors));
      } else if (response.data?.createPost.post.id) {
        // Go back to home page on success
        history.push('/');
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
          Create Post
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                //required
                fullWidth
                id='title'
                label='Post Title'
                name='title'
                autoComplete='title'
                autoFocus={true}
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                //required
                fullWidth
                name='text'
                label='Post Text'
                //type='password'
                id='text'
                autoComplete='text'
                multiline
                rows={8}
                rowsMax={20}
                value={formik.values.text}
                onChange={formik.handleChange}
                error={formik.touched.text && Boolean(formik.errors.text)}
                helperText={formik.touched.text && formik.errors.text}
              />
            </Grid>
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            Submit Post
          </Button>
        </form>
      </div>
    </Container>
  );
};

export { CreatePost };
