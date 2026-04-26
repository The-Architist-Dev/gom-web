import React from 'react';
import { Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { AppLayout } from '../components/layout/AppLayout';

// Auth
import { NewAuthShell } from '../components/auth/NewAuthShell';

// Features
import { AnalysisPageWrapper } from '../features/analysis/AnalysisPageWrapper';
import { CeramicsPageWrapper } from '../features/ceramics/CeramicsPageWrapper';
import { HistoryPageWrapper } from '../features/history/HistoryPageWrapper';
import { ProfilePageWrapper } from '../features/profile/ProfilePageWrapper';
import { PaymentPageWrapper } from '../features/payment/PaymentPageWrapper';
import { TransactionsPageWrapper } from '../features/transactions/TransactionsPageWrapper';
import { ContactPageWrapper } from '../features/contact/ContactPageWrapper';
import { AboutPage } from '../features/about/AboutPage';
import { TermsPage } from '../features/legal/TermsPage';
import { PrivacyPage } from '../features/legal/PrivacyPage';
import { AdminPageWrapper } from '../features/admin/AdminPageWrapper';

// Guards
import { ProtectedRoute } from './ProtectedRoute';
import { GuestOnlyRoute } from './GuestOnlyRoute';
import { AdminRoute } from './AdminRoute';

// 404
import { NotFoundPage } from '../features/errors/NotFoundPage';
import { UnauthorizedPage } from '../features/errors/UnauthorizedPage';

/**
 * Route configuration for the app.
 * Uses HashRouter for static hosting compatibility.
 */
export const routes = [
  // ── Auth Routes (guest-only) ──
  {
    path: '/auth',
    element: <GuestOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <NewAuthShell />,
          },
        ],
      },
    ],
  },

  // ── App Routes (protected + public) ──
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Home - protected, requires auth
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AnalysisPageWrapper />
          </ProtectedRoute>
        ),
      },

      // Protected routes
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPageWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePageWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <PaymentPageWrapper />
          </ProtectedRoute>
        ),
      },
      {
        path: 'transactions',
        element: (
          <ProtectedRoute>
            <TransactionsPageWrapper />
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <AdminPageWrapper />,
          },
        ],
      },

      // Public routes (accessible without auth)
      {
        path: 'ceramics',
        element: <CeramicsPageWrapper />,
      },
      {
        path: 'contact',
        element: <ContactPageWrapper />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },

      // Error pages
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

