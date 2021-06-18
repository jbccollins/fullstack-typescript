import { makeStyles, createStyles, Theme } from '@material-ui/core';
import React, { useEffect } from 'react';
import { CircularLoadingIndicator } from '@components/Layout/CircularLoadingIndicator';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    overlay: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      width: '100vw',
      height: '100vh',
      backgroundColor: `${theme.palette.grey.A100}90`, // rgba
      zIndex: 100000000,
    },
    loadingIndicator: {
      marginTop: 'calc(50vh - 20px)',
      marginLeft: 'calc(50vw - 20px)',
    },
  })
);

export const FixedLoadingOverlay: React.FC = () => {
  useEffect(() => {
    // Your code here
    document.querySelector('body').style.overflow = 'hidden';
    return () => {
      document.querySelector('body').style.overflow = '';
    };
  }, []);
  const classes = useStyles();
  return (
    <div className={classes.overlay}>
      <CircularLoadingIndicator extraClasses={[classes.loadingIndicator]} />
    </div>
  );
};
