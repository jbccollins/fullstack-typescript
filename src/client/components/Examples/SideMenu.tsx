import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, ListItemProps, ExtendButtonBase, ListItemTypeMap, SvgIconTypeMap } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import UsageIcon from '@material-ui/icons/Code';
import HomeIcon from '@material-ui/icons/Home';
import RouterIcon from '@material-ui/icons/Storage';
import FetchIcon from '@material-ui/icons/CloudDownload';
import StyledIcon from '@material-ui/icons/Style';
import LazyIcon from '@material-ui/icons/SystemUpdateAlt';
import LayersIcon from '@material-ui/icons/Layers';
import GraphqlIcon from '@material-ui/icons/Grain';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import PeopleIcon from '@material-ui/icons/People';
import RegisterIcon from '@material-ui/icons/Assignment';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

class NavLinkMui extends React.Component<any> {
  render() {
    const { forwardedRef, to, ...props } = this.props;
    return <NavLink {...props} ref={forwardedRef} to={to} />;
  }
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

export const SideMenu: React.FunctionComponent = () => {
  const classes = useStyles({});
  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem button component={NavLinkMui} to='/'>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary='Home' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/usage'>
          <ListItemIcon>
            <UsageIcon />
          </ListItemIcon>
          <ListItemText primary='Usage' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={NavLinkMui} to='/fetch-example'>
          <ListItemIcon>
            <FetchIcon />
          </ListItemIcon>
          <ListItemText primary='Fetch' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/lazy-example'>
          <ListItemIcon>
            <LazyIcon />
          </ListItemIcon>
          <ListItemText primary='Lazy Loading' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/styled-example'>
          <ListItemIcon>
            <StyledIcon />
          </ListItemIcon>
          <ListItemText primary='Styled Components' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/router-example/1234'>
          <ListItemIcon>
            <RouterIcon />
          </ListItemIcon>
          <ListItemText primary='React-Router' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/redux-example'>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary='Redux' />
        </ListItem>
        <ListItem button component={NavLinkMui} to='/graphql-example'>
          <ListItemIcon>
            <GraphqlIcon />
          </ListItemIcon>
          <ListItemText primary='GraphQL' />
        </ListItem>
        <Divider />
        <List>
          <ListItem button component={NavLinkMui} to='/register'>
            <ListItemIcon>
              <RegisterIcon />
            </ListItemIcon>
            <ListItemText primary='Register' />
          </ListItem>
          <ListItem button component={NavLinkMui} to='/login'>
            <ListItemIcon>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary='Log in' />
          </ListItem>
          <ListItem button component={NavLinkMui} to='/users'>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary='Manage Users' />
          </ListItem>
          <ListItem button component={NavLinkMui} to='/register'>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary='My Profile' />
          </ListItem>
        </List>
      </List>
    </Drawer>
  );
};
