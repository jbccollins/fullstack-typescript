import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React, { useEffect, useState } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { IUserPersisted } from '@shared/models/User';
import { loadUsersAPI } from '@client/utils/api-facade';
import { User } from './User';
import { getUserFullName } from '@shared/utils/getUserFullName';
interface IUsersState {
  users: IUserPersisted[];
  isLoading: boolean;
}

export const UsersList: React.FC = () => {
  const [usersState, setUsersState] = useState<IUsersState>({
    users: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await loadUsersAPI();
      setUsersState({
        users,
        isLoading: false,
      });
    };
    fetchUsers();
  }, []);

  const getUserById = (userId: string) => {
    return usersState.users.find((u) => u.id.toString() === userId);
  };

  if (usersState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Users List' />
          <CardContent>
            <List>
              {usersState.users.map((user) => (
                <ListItem key={user.id}>
                  <NavLink to={`/fetch-example/${user.id}`}>{getUserFullName(user)}</NavLink>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Route
          exact
          path='/fetch-example/:userId'
          render={(props) => <User user={getUserById(props.match.params.userId)} />}
        />
      </Grid>
    </>
  );
};
