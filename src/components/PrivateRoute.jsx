import React from 'react';
// Authentication imports commented out for now
// import { Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children }) {
  // TEMPORARILY BYPASS AUTHENTICATION FOR DEBUGGING
  return children;
  
  // Original authentication logic (commented out for debugging)
  /*
  // Get current user and loading state from auth context
  const { currentUser, loading } = useContext(AuthContext);
  
  // If still loading auth state, return nothing or a loading spinner
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is authenticated, render the children
  // Otherwise, redirect to login page
  return currentUser ? children : <Navigate to="/login" />;
  */
}

export default PrivateRoute;
