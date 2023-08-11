import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from '../../../services/Auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = Auth.isUserLogin();
  
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
