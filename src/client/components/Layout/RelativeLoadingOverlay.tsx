import React from 'react';
import { CircularLoadingIndicator } from '@client/components/Layout/CircularLoadingIndicator';
import { makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    overlay: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    loadingIndicator: {
      width: '40px',
      height: '40px',
      margin: 'auto',
      position: 'absolute',
      top: '0',
      left: '0',
      bottom: '0',
      right: '0',
    },
  })
);
export const RelativeLoadingOverlay: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.overlay}>
      <CircularLoadingIndicator extraClasses={[classes.loadingIndicator]} />
    </div>
  );
};
