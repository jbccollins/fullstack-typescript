//Example: https://github.com/christofferberg/react-redux-toolkit-example/blob/2d0ad9409c694527ed0e12f44d92b79c7c1b7cd5/src/features/counter/Counter.tsx
import { Card, CardContent, CardHeader, IconButton, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SubtractIcon from '@material-ui/icons/Remove';
import React from 'react';
import { useAppSelector, useAppDispatch } from '@store/hooks';

import {
  decrement,
  increment,
  incrementByAmountAsync,
  incrementByAmount,
  reset,
  selectCounter,
} from '@store/slices/counterSlice';

const useStyles = makeStyles(() => ({
  CounterValue: {
    background: 'lightgrey',
    padding: '8px 20px',
    marginRight: '10px',
  },
}));

export const ReduxExample: React.FunctionComponent = () => {
  const classes = useStyles({});

  const dispatch = useAppDispatch();

  // State selectors
  const { value, loading, error } = useAppSelector(selectCounter);

  const handleDecrementClick = () => {
    dispatch(decrement());
  };
  const handleIncrementClick = () => {
    dispatch(increment());
  };
  return (
    <Card>
      <CardHeader title='Redux Example' />
      <CardContent>
        <Typography>Increment and decrement a counter, the value of which is stored in a redux store!</Typography>
        <div className={classes.CounterValue}>{value}</div>
        <IconButton color='primary' aria-label='increment' onClick={handleDecrementClick}>
          <SubtractIcon />
        </IconButton>
        <IconButton color='primary' aria-label='increment' onClick={handleIncrementClick}>
          <AddIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};
