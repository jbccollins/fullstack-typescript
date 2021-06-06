import { CssBaseline, makeStyles } from '@material-ui/core';
import { createMuiTheme, createStyles, responsiveFontSizes, Theme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // Pages
import { Header } from '@components/Examples/Header';
import { SideMenu } from '@components/Examples/SideMenu';
import { Home } from '@components/Examples/Home';
import { Usage } from '@components/Examples/Usage';
import { LazyLoadingExample } from '@components/Examples/LazyLoadingExample';
import { RouterExample } from '@components/Examples/RouterExample';
import { StyledComponentsExample } from '@components/Examples/StyledComponentsExample';
import { ReduxExample } from '@components/Examples/ReduxExample';
import { UsersList } from '@components/Examples/UsersList';
import { hot } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as UrqlProvider, createClient } from 'urql';
import store from '@store/store';
import { GraphQLExample } from '@components/Examples/GraphQLExample';
import { Register } from '@components/pages/Register';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { Login } from './components/pages/Login';

const client = createClient({
  url: 'http://localhost:3000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
});

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
