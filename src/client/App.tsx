import { GraphQLExample } from '@components/Examples/GraphQLExample';
import { Header } from '@components/Examples/Header';
import { Home } from '@components/Examples/Home';
import { LazyLoadingExample } from '@components/Examples/LazyLoadingExample';
import { ReduxExample } from '@components/Examples/ReduxExample';
import { RouterExample } from '@components/Examples/RouterExample';
import { SideMenu } from '@components/Examples/SideMenu';
import { StyledComponentsExample } from '@components/Examples/StyledComponentsExample';
import { Usage } from '@components/Examples/Usage';
import { UsersList } from '@components/Examples/UsersList';
import { UsersList as UsersListPage} from '@components/pages/UsersList';
import { Register } from '@components/pages/Register';
import { CssBaseline, makeStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
import { createMuiTheme, createStyles, responsiveFontSizes, Theme, ThemeProvider } from '@material-ui/core/styles';
import store from '@store/store';
import { createUrqlClient } from '@utils/createUrqlClient';
import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // Pages
import { Provider as UrqlProvider } from 'urql';
import { Login } from './components/pages/Login';

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
  }),
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
  }),
);

const App = () => {
  const classes = useStyles({});

  return (
    <BrowserRouter>
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
            <Route path='/register' component={Register} />
            <Route path='/login' component={Login} />
            <Route path='/users' component={UsersListPage} />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
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
