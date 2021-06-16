import { useUsersQuery } from '@client/generated/graphql';
import React from 'react';
import { RelativeLoadingOverlay } from '@components/Layout/RelativeLoadingOverlay';
import { Grid, Card, CardHeader, CardContent, List, Box } from '@material-ui/core';

export const UsersList: React.FC = () => {
  const [{ fetching, data }, _results] = useUsersQuery();
  return (
    <>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Users List' />
          <CardContent>
            {fetching && (
              <Box p={10}>
                <RelativeLoadingOverlay />
              </Box>
            )}
            {!fetching && data && (
              <List>
                {data.users.map((user) => (
                  <div key={user.id}>{user.email}</div>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
      {/* {fetching && <RelativeLoadingOverlay/>}
      {!data ? null : data.users.map(user => <div key={user.id}>{user.email}</div>)} */}
    </>
  );
};
