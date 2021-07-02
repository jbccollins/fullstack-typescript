import { useMeQuery } from '@client/generated/graphql';
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import history from '@client/utils/history';
import ILocationState from '@client/utils/ILocationState';

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const [{ data, fetching: meFetching }] = useMeQuery();
  let auth = false;
  if (meFetching) {
    auth = false;
  } else if (!data?.me) {
    auth = false;
  } else {
    auth = true;
  }
  console.log(history.location);
  if (auth) {
    return <Route path={props.path} exact={props.exact} component={props.component} />;
  } else {
    const state: ILocationState = {
      from: history.location,
      referred: true,
    };
    return (
      <Redirect
        to={{
          pathname: '/login',
          state,
        }}
      />
    );
  }
};
export default PrivateRoute;
