import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { getUserFullName } from '@shared/utils';
import { IUserModelCreated } from '@shared/models/User';

interface IProps {
  user: IUserModelCreated;
}

export const User: React.FunctionComponent<IProps> = ({ user }) => (
  <Card>
    <CardHeader title={`User: ${getUserFullName(user)}`} />
    <CardContent>
      <Typography>Id: {user.id}</Typography>
      <Typography>Email: {user.email}</Typography>
    </CardContent>
  </Card>
);
