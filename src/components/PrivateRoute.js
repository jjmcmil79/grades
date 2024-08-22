import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    
    console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('PrivateRoute - Rendering protected content');
      return children;
    } else {
      console.log('PrivateRoute - Redirecting to /auth');
      return <Navigate to="/auth" />;
    }
  }

export default PrivateRoute;