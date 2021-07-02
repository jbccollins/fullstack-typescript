import { GraphQLExample } from '@client/components/Examples/GraphQLExample';
import { Header } from '@client/components/Examples/Header';
import { Home } from '@client/components/Examples/Home';
import { LazyLoadingExample } from '@client/components/Examples/LazyLoadingExample';
import { ReduxExample } from '@client/components/Examples/ReduxExample';
import { RouterExample } from '@client/components/Examples/RouterExample';
import { SideMenu } from '@client/components/Examples/SideMenu';
import { StyledComponentsExample } from '@client/components/Examples/StyledComponentsExample';
import { Usage } from '@client/components/Examples/Usage';
import { UsersList } from '@client/components/Examples/UsersList';
import { UsersList as UsersListPage } from '@client/components/pages/UsersList';
import { Register } from '@client/components/pages/Register';
import { CssBaseline, makeStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import { createMuiTheme, createStyles, responsiveFontSizes, Theme, ThemeProvider } from '@material-ui/core/styles';
import store from '@client/store/store';
import { createUrqlClient } from '@client/utils/createUrqlClient';
import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider as UrqlProvider } from 'urql';
import { Login } from './components/pages/Login';
import { ChangePassword } from './components/pages/ChangePassword';
import { CreatePost } from './components/pages/CreatePost';
import history from './utils/history';
import PrivateRoute from './components/routing/PrivateRoute';

const client = createUrqlClient();

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      //type: 'dark',
      primary: {
        main: purple[500],
      },
      secondary: {
        main: green[500],
      },
    },
  })
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    main: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
  })
);

const App = () => {
  const classes = useStyles({});

  return (
    <Router history={history}>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <SideMenu />
        <main className={classes.main}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/usage' component={Usage} />
            <Route path='/fetch-example' component={UsersList} />
            <Route path='/lazy-example' component={LazyLoadingExample} />
            <Route path='/styled-example' component={StyledComponentsExample} />
            <Route path='/router-example/:slug' component={RouterExample} />
            <Route path='/redux-example' component={ReduxExample} />
            <Route path='/graphql-example' component={GraphQLExample} />
            <PrivateRoute path='/create-post' component={CreatePost} />
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/users' component={UsersListPage} />
            <Route exact path='/change-password/:token' component={ChangePassword} />
            <Route path='/change-password' component={ChangePassword} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

const AppWrapper = () => {
  return (
    <ReduxProvider store={store}>
      {' '}
      <UrqlProvider value={client}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </UrqlProvider>
    </ReduxProvider>
  );
};

export default hot(module)(AppWrapper);
