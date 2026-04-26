import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useNotify } from './hooks/useNotify';
import { useView } from './hooks/useView';

// Layout & UI
import { MainHeader } from './components/layout/MainHeader';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { DarkModeBackground } from './theme/DarkModeBackground';

// Auth
import { NewAuthShell } from './components/auth/NewAuthShell';

// Features
import { AnalysisPage } from './features/analysis/AnalysisPage';
import { CeramicsPage } from './features/ceramics/CeramicsPage';
import { HistoryPage } from './features/history/HistoryPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { PaymentPage } from './features/payment/PaymentPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { ContactPage } from './features/contact/ContactPage';
import { AboutPage } from './features/about/AboutPage';
import { TermsPage } from './features/legal/TermsPage';
import { PrivacyPage } from './features/legal/PrivacyPage';
import { AdminPage } from './features/admin/AdminPage';

// Constants
import { VIEWS, PUBLIC_VIEWS, GOOGLE_CLIENT_ID } from './lib/constants';

function App() {
  const { token, setToken, user, setUser, quota, setQuota, fetchUser, logout } = useAuth();
  const { toasts, notify, dismiss } = useNotify();
  const [view, setView] = useView(VIEWS.DEBATE);

  // Auth subview (login | register | forgot | reset)
  const [subView, setSubView] = useState('login');
  const [resetEmail, setResetEmail] = useState('');

  const isPublicView = PUBLIC_VIEWS.includes(view);

  // Inject Google Identity Services script once
  useEffect(() => {
    if (document.getElementById('google-identity-script')) return;
    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Set Google client id meta (read by NewAuthShell)
  useEffect(() => {
    let meta = document.querySelector('meta[name="google-signin-client_id"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'google-signin-client_id');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', GOOGLE_CLIENT_ID);
  }, []);

  // ── Loading splash while we check user from token ──────────────────
  // (We render auth shell if no token; otherwise we wait for /user to populate.)

  // ── Auth gate ──
  if (!token && !isPublicView) {
    return (
      <>
        <NewAuthShell
          setToken={setToken}
          setUser={setUser}
          notify={notify}
          subView={subView}
          setSubView={setSubView}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  // ── Main app shell ──
  return (
    <div className="relative flex min-h-screen flex-col bg-ivory dark:bg-dark-bg">
      <DarkModeBackground />
      {token && user && (
        <MainHeader
          user={user}
          quota={quota}
          view={view}
          setView={setView}
          logout={async () => {
            await logout();
            setView(VIEWS.DEBATE);
          }}
        />
      )}

      <main className="flex-1">
        {/* Public-friendly routes (work even without auth) */}
        {view === VIEWS.LINES && <CeramicsPage notify={notify} />}
        {view === VIEWS.CONTACT && <ContactPage notify={notify} />}
        {view === VIEWS.ABOUT && <AboutPage />}
        {view === VIEWS.TERMS && <TermsPage />}
        {view === VIEWS.PRIVACY && <PrivacyPage />}

        {/* Logged-in only views */}
        {token && view === VIEWS.DEBATE && (
          <AnalysisPage
            token={token}
            notify={notify}
            quota={quota}
            setQuota={setQuota}
            setView={setView}
            user={user}
          />
        )}
        {token && view === VIEWS.HISTORY && (
          <HistoryPage setView={setView} notify={notify} />
        )}
        {token && view === VIEWS.PROFILE && (
          <ProfilePage user={user} fetchUser={fetchUser} notify={notify} />
        )}
        {token && view === VIEWS.PAYMENT && (
          <PaymentPage fetchUser={fetchUser} notify={notify} setView={setView} />
        )}
        {token && view === VIEWS.TRANSACTION_HISTORY && (
          <TransactionsPage setView={setView} notify={notify} />
        )}
        {token && view === VIEWS.ADMIN && <AdminPage user={user} notify={notify} />}

        {/* Public-friendly default landing */}
        {!token && view === VIEWS.DEBATE && <PublicLanding setView={setView} />}
      </main>

      <Footer setView={setView} />

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

// Lightweight public landing - prompts to log in for analysis
const PublicLanding = ({ setView }) => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <Loader2 className="mb-6 h-12 w-12 animate-spin text-gold" />
      <h2 className="font-heading text-3xl font-extrabold text-navy dark:text-ivory">
        {t('app.name')}
      </h2>
      <p className="mt-3 max-w-md text-sm text-muted dark:text-dark-text-muted">
        {t('app.tagline')}
      </p>
      <button
        type="button"
        onClick={() => setView(VIEWS.LINES)}
        className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark"
      >
        {t('home.ctaExplore')}
      </button>
    </div>
  );
};

export default App;
