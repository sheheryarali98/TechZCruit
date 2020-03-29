import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
// import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import CommunityRoutes from './components/routing/CommunityRoutes';
import CrowdfundingRoutes from './components/routing/CrowdfundingRoutes';
import TestingRoutes from './components/routing/TestingRoutes';
import EcommerceRoutes from './components/routing/EcommerceRoutes';
import FreelanceRoutes from './components/routing/FreelanceRoutes';
import BasicRoutes from './components/routing/BasicRoutes';
import Chat from './components/chat/Chat';
// import Join from './components/chatapp/Join/Join';
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
          <Switch>
            {/* Chat App Routes */}
            <Route exact path='/chat' component={Chat} />
            {/* <Route exact path='/chatapp/join' component={Join} /> */}

            <Route path='/community' component={CommunityRoutes} />
            <Route path='/crowdfunding' component={CrowdfundingRoutes} />
            <Route path='/testing' component={TestingRoutes} />
            <Route path='/ecommerce' component={EcommerceRoutes} />
            <Route path='/freelance' component={FreelanceRoutes} />
            <Route component={BasicRoutes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
