import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotify } from '../../hooks/useNotify';
import { AdminPage } from './AdminPage';

export const AdminPageWrapper = () => {
  const { user } = useAuth();
  const { notify } = useNotify();

  return <AdminPage user={user} notify={notify} />;
};
