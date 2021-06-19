import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { getUserFullName } from '@shared/utils/getUserFullName';
import { IUserPersisted } from '@shared/models/User';

interface IProps {
  user: IUserPersisted;
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
