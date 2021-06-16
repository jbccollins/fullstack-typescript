import { Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { useParams } from 'react-router-dom';

export const GraphQLExample: React.FunctionComponent = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log(slug);
  return (
    <Card>
      <CardHeader title='GraphQL Example' />
      <CardContent>
        <Typography>
          <a href='/graphql' target='_blank'>
            Here is the direct link to the GraphQL Playground
          </a>
        </Typography>
        <iframe src='/graphql' height='500' width='100%'></iframe>
      </CardContent>
    </Card>
  );
};
