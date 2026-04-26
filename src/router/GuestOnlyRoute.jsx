import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * GuestOnlyRoute - only accessible when NOT logged in.
 * Redirects to home or intended route if already authenticated.
 */
export const GuestOnlyRoute = () => {
  const { token } = useAuth();
  const location = useLocation();

  if (token) {
    // If already logged in, redirect to intended route or home
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

