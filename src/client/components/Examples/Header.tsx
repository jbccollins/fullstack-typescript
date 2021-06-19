import { AppBar, IconButton, Link, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '@client/generated/graphql';
import ReactRouterLink from '@client/components/aliases/RouterLink';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    spacer: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);
export const Header: React.FunctionComponent = () => {
  const classes = useStyles({});
  //const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [{ data, fetching: meFetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let auth = false;

  if (meFetching) {
    auth = false;
  } else if (!data?.me) {
    auth = false;
  } else {
    auth = true;
  }

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <Typography variant='h6' noWrap className={classes.title}>
          Fullstack TypeScript
        </Typography>
        {!auth && (
          <>
            <Link color='inherit' component={ReactRouterLink} to='/login'>
              Log in
            </Link>
            <span className={classes.spacer}>|</span>
            <Link color='inherit' component={ReactRouterLink} to='/register'>
              Register
            </Link>
          </>
        )}
        {auth && (
          <div>
            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              {auth && (
                <MenuItem disabled={logoutFetching} onClick={handleClose}>
                  My Profile
                </MenuItem>
              )}
              {auth && (
                <MenuItem disabled={logoutFetching} onClick={handleLogout}>
                  Log out
                </MenuItem>
              )}
              {/* {!auth && <MenuItem onClick={handleLogin}>Log in</MenuItem>} */}
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};
