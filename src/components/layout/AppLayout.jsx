import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MainHeader } from './MainHeader';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { useNotify } from '../../hooks/useNotify';

/**
 * AppLayout - main app shell with header, footer, and content area.
 * NO animated background here - clean static background for all pages except auth.
 */
export const AppLayout = () => {
  const { token, user, quota, logout } = useAuth();
  const { toasts, dismiss } = useNotify();

  return (
    <div className="relative flex min-h-screen flex-col bg-ivory dark:bg-dark-bg">
      {/* NO DarkModeBackground here - only in AuthLayout */}
      
      {token && user && (
        <MainHeader
          user={user}
          quota={quota}
          logout={logout}
        />
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};
