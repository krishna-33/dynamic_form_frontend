import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate  } from 'react-router-dom';
import { selectIsLoggedIn } from '../redux/authSlice';
import Header from '../common/header';

const RequireAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    return isLoggedIn ? <> <Header /><Component {...props} /></> : <Navigate  to="/signin" />;
  };

  return AuthenticatedComponent;
};

export default RequireAuth;
