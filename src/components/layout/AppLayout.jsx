import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MainHeader } from './MainHeader';
import { Footer } from './Footer';
import { useNotify } from '../../hooks/useNotify';

// AppLayout — main app shell with header, footer, and content area
export const AppLayout = () => {
  const { token, user, quota, logout, fetchUser } = useAuth();
  const { notify } = useNotify();

  return (
    <div className="relative flex min-h-screen flex-col bg-ivory dark:bg-dark-bg">
      {token && user && (
        <MainHeader
          user={user}
          quota={quota}
          logout={logout}
        />
      )}

      <main className="flex-1">
        <Outlet context={{ notify, fetchUser }} />
      </main>

      <Footer />
    </div>
  );
};

