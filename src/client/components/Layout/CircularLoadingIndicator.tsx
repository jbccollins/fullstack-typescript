import { CircularProgress, createStyles, makeStyles } from '@material-ui/core';
import React from 'react';

interface CircularLoadingIndicatorProps {
  disableShrink?: boolean,
  extraClasses?: string[]
}

const useStyles = makeStyles(() =>
  createStyles({
    loadingIndicator: {
      display: 'inline-block'
    }
  })
);

export const CircularLoadingIndicator: React.FC<CircularLoadingIndicatorProps> = ({ disableShrink = true, extraClasses = [] }) => {
  const classes = useStyles();
  const className = classes.loadingIndicator + ` ${extraClasses.join(' ')}`;

  return (
    <div className={className}>
      <CircularProgress
        variant="indeterminate"
        disableShrink={disableShrink}
      />
    </div>
  );
}