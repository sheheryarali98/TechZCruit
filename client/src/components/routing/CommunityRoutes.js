import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Alert from '../../components/layout/Alert';
import Register from '../../components/auth/Register';
import Login from '../../components/auth/Login';
import Dashboard from '../../components/dashboard/Dashboard';
import CreateProfile from '../../components/profile-forms/CreateProfile';
import EditProfile from '../../components/profile-forms/EditProfile';
import AddExperience from '../../components/profile-forms/AddExperience';
import AddEducation from '../../components/profile-forms/AddEducation';
import Profiles from '../../components/profiles/Profiles';
import Profile from '../../components/profile/Profile';
import Posts from '../../components/posts/Posts';
import Post from '../../components/post/Post';

export const CommunityRoutes = () => {
  return (
    // <Switch>
    <Fragment>
      <Route exact path='/register' component={Register} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/profiles' component={Profiles} />
      <Route exact path='/profile/:id' component={Profile} />
      <PrivateRoute exact path='/dashboard' component={Dashboard} />
      <PrivateRoute exact path='/create-profile' component={CreateProfile} />
      <PrivateRoute exact path='/edit-profile' component={EditProfile} />
      <PrivateRoute exact path='/add-experience' component={AddExperience} />
      <PrivateRoute exact path='/add-education' component={AddEducation} />
      <PrivateRoute exact path='/posts' component={Posts} />
      <PrivateRoute exact path='/post/:id' component={Post} />
    </Fragment>
    // </Switch>
  );
};

export default CommunityRoutes;