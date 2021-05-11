import { CssBaseline, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
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
import { Provider } from 'react-redux';
import store from '@store/store';

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
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      {' '}
      <App />
    </Provider>
  );
};

export default hot(module)(AppWrapper);
