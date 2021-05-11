import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { createShallow } from '@material-ui/core/test-utils';
import React from 'react';
import { IUserModelCreated } from '@shared/models/User';
import { User } from './User';

describe('<User/>', () => {
  const user: IUserModelCreated = {
    id: 123,
    firstName: 'Gil',
    lastName: 'Amran',
    email: 'GilAmran@gmail.com',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const MUIShallow = createShallow();

  it('should display the user inside a Card component', () => {
    const wrapper = MUIShallow(<User user={user} />);
    expect(wrapper.find(Card).length).toEqual(1);
  });

  it('should display the user name on the card title', () => {
    const wrapper = MUIShallow(<User user={user} />);
    expect(wrapper.find(CardHeader).props().title).toEqual(`User: Gil Amran`);
  });

  it('should display 2 Typography component', () => {
    const wrapper = MUIShallow(<User user={user} />);
    expect(wrapper.find(Typography).length).toEqual(2);
  });

  it('should display user id in the first Typography', () => {
    const wrapper = MUIShallow(<User user={user} />);
    const userIdComp = wrapper.find(Typography).at(0);
    const content = userIdComp.dive().dive();
    expect(content.text()).toEqual('Id: 123');
  });

  it('should display user email in the 2nd Typography', () => {
    const wrapper = MUIShallow(<User user={user} />);
    const userEmailComp = wrapper.find(Typography).at(1);
    const content = userEmailComp.dive().dive();
    expect(content.text()).toEqual('Email: GilAmran@gmail.com');
  });
});
