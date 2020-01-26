import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
// import HomePage from './components/crowdfunding/homepage/HomePage';
// import CampaignForm from './components/crowdfunding/layout/CampaignForm';
import CommunityRoutes from './components/routing/CommunityRoutes';
import HomePage from './components/crowdfunding/layout/HomePage';
import CampaignForm from './components/crowdfunding/layout/campaign-form/CampaignForm';
import Campaign from './components/crowdfunding/layout/campaign/Campaign';
import SearchCampaign from './components/crowdfunding/layout/campaigncategory/SearchCampaign';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/crowdfunding/homepage' component={HomePage} />
              <Route
                exact
                path='/crowdfunding/campaign/:id'
                component={Campaign}
              />
              <Route
                exact
                path='/crowdfunding/searchcampaign'
                component={SearchCampaign}
              />
              <PrivateRoute
                exact
                path='/crowdfunding/campaign-form'
                component={CampaignForm}
              />
              <Route component={CommunityRoutes} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
