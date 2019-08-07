import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import Landing from './Landing';
import SignIn from './SignIn';
import LogOut from './LogOut';
import AppHome from './AppHome';
import Share from './Share';
import NewsList from './NewsList';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/sign-in/" exact component={SignIn} />
      <Route path="/log-out/" exact component={LogOut} />
      <Route path="/app/" exact component={NewsList} />
      <Route path="/app/categories/:category/" exact 
        component={renderProps => <NewsList isCategory={true} {...renderProps} />} />
      <Route path="/app/share/:linkToShare/" exact component={Share} />
    </Switch>
  )
};

export default Routes;