import { useUsersQuery } from '@client/generated/graphql';
import React from 'react';
import { RelativeLoadingOverlay } from '@components/Layout/RelativeLoadingOverlay';
import { FixedLoadingOverlay } from '@components/Layout/FixedLoadingOverlay';
import { Grid, Card, CardHeader, CardContent, List, ListItem, Box } from '@material-ui/core';
import { getUserFullName } from '@shared/utils';
import { NavLink } from 'react-router-dom';
interface UsersListProps {

}

export const UsersList: React.FC<UsersListProps> = ({}) => {
  const [{fetching, data}, results] = useUsersQuery()
  return (
    <>
      
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Users List' />
            <CardContent>
              {fetching && <Box p={10}><RelativeLoadingOverlay/></Box>}
              {!fetching && data &&
                <List>
                  {data.users.map(user => <div key={user.id}>{user.email}</div>)}
                </List>
              }
            </CardContent>
          </Card>
        </Grid>
      {/* {fetching && <RelativeLoadingOverlay/>}
      {!data ? null : data.users.map(user => <div key={user.id}>{user.email}</div>)} */}
    </>
  );
}