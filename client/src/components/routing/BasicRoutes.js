import React, { Fragment } from 'react';
import PrivateRoute from './PrivateRoute';
import { Route } from 'react-router-dom';
import Register from '../../components/auth/Register';
import Login from '../../components/auth/Login';
import Dashboard from '../../components/dashboard/Dashboard';
import CreateProfile from '../../components/profile-forms/CreateProfile';
import EditProfile from '../../components/profile-forms/EditProfile';
import AddExperience from '../../components/profile-forms/AddExperience';
import AddEducation from '../../components/profile-forms/AddEducation';
import Profile from '../../components/profile/Profile';
import Settings from '../../components/settings/Settings';

export const BasicRoutes = () => {
  return (
    <Fragment>
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <PrivateRoute exact path='/profile/:id' component={Profile} />
      <PrivateRoute exact path='/dashboard' component={Dashboard} />
      <PrivateRoute exact path='/create-profile' component={CreateProfile} />
      <PrivateRoute exact path='/edit-profile' component={EditProfile} />
      <PrivateRoute exact path='/add-experience' component={AddExperience} />
      <PrivateRoute exact path='/add-education' component={AddEducation} />
      <PrivateRoute exact path='/settings' component={Settings} />
    </Fragment>
  );
};

export default BasicRoutes;
