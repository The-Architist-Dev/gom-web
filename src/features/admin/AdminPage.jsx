import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, Layers, Receipt, Sparkles } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/states';
import { adminApi } from './api';
import { cn, formatVND, formatDate, getErrorMessage } from '../../lib/utils';

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'users', icon: Users },
  { id: 'ceramics', icon: Layers },
  { id: 'payments', icon: Receipt },
  { id: 'predictions', icon: Sparkles },
];

export const AdminPage = ({ user, notify }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('dashboard');

  if (user?.role !== 'admin') {
    return (
      <PageContainer>
        <EmptyState
          title={t('errors.forbidden')}
          description="Bạn không có quyền truy cập khu vực này."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title={t('admin.title')} subtitle={t('admin.subtitle')} />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-stroke dark:border-dark-stroke">
        {TABS.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setTab(it.id)}
            className={cn(
              '-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors',
              tab === it.id
                ? 'border-gold text-navy dark:text-ivory'
                : 'border-transparent text-muted hover:text-navy dark:text-dark-text-muted dark:hover:text-ivory'
            )}
          >
            <it.icon size={16} />
            {t('admin.tabs.' + it.id)}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && <DashboardTab notify={notify} />}
      {tab === 'users' && <UsersTab notify={notify} />}
      {tab === 'ceramics' && <CeramicsTab notify={notify} />}
      {tab === 'payments' && <PaymentsTab notify={notify} />}
      {tab === 'predictions' && <PredictionsTab notify={notify} />}
    </PageContainer>
  );
};

const useFetch = (fn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fn()
      .then((res) => setData(res.data?.data ?? res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};

const DashboardTab = () => {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useFetch(() => adminApi.dashboard());
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const stats = data?.stats || data || {};

  const cards = [
    { key: 'users', value: stats.total_users ?? stats.users ?? 0, icon: Users },
    { key: 'predictions', value: stats.total_predictions ?? stats.predictions ?? 0, icon: Sparkles },
    { key: 'ceramics', value: stats.total_ceramics ?? stats.ceramics ?? 0, icon: Layers },
    { key: 'revenue', value: formatVND(stats.total_revenue ?? stats.revenue ?? 0), icon: Receipt },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-muted dark:text-dark-text-muted">
              {t('admin.stats.' + c.key)}
            </span>
            <c.icon className="text-gold" size={18} />
          </div>
          <p className="mt-3 font-heading text-3xl font-black text-navy dark:text-ivory">
            {c.value}
          </p>
        </Card>
      ))}
    </div>
  );
};

const UsersTab = () => {
  const { data, loading, error, reload } = useFetch(() => adminApi.users());
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const list = Array.isArray(data) ? data : data?.data || [];

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stroke bg-surface-alt text-left dark:border-dark-stroke dark:bg-dark-surface-alt">
            <tr className="text-xs uppercase tracking-wider text-muted dark:text-dark-text-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b border-stroke last:border-b-0 dark:border-dark-stroke">
                <td className="px-4 py-3 font-mono text-xs">#{u.id}</td>
                <td className="px-4 py-3 font-bold text-navy dark:text-ivory">{u.name}</td>
                <td className="px-4 py-3 text-muted dark:text-dark-text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'admin' ? 'gold' : 'default'}>{u.role || 'user'}</Badge>
                </td>
                <td className="px-4 py-3">{u.token_balance ?? 0}</td>
                <td className="px-4 py-3 text-xs">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const CeramicsTab = () => {
  const { data, loading, error, reload } = useFetch(() => adminApi.ceramics());
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const list = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((line) => (
        <Card key={line.id} padded={false} className="overflow-hidden">
          {line.image_url && (
            <div className="aspect-[4/3] overflow-hidden bg-surface-alt dark:bg-dark-surface-alt">
              <img src={line.image_url} alt={line.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted dark:text-dark-text-muted">#{line.id}</span>
              {line.is_featured && <Badge variant="gold">Featured</Badge>}
            </div>
            <h3 className="font-heading text-base font-bold text-navy dark:text-ivory">
              {line.name}
            </h3>
            <p className="text-xs text-muted dark:text-dark-text-muted">{line.country}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

const PaymentsTab = () => {
  const { data, loading, error, reload } = useFetch(() => adminApi.payments());
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const list = Array.isArray(data) ? data : data?.data || [];

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stroke bg-surface-alt text-left dark:border-dark-stroke dark:bg-dark-surface-alt">
            <tr className="text-xs uppercase tracking-wider text-muted dark:text-dark-text-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-stroke last:border-b-0 dark:border-dark-stroke">
                <td className="px-4 py-3 font-mono text-xs">#{p.id}</td>
                <td className="px-4 py-3">{p.user?.name || p.user_id}</td>
                <td className="px-4 py-3 font-bold">{formatVND(p.amount)}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'
                    }
                  >
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const PredictionsTab = () => {
  const { data, loading, error, reload } = useFetch(() => adminApi.predictions());
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const list = Array.isArray(data) ? data : data?.data || [];

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-stroke bg-surface-alt text-left dark:border-dark-stroke dark:bg-dark-surface-alt">
            <tr className="text-xs uppercase tracking-wider text-muted dark:text-dark-text-muted">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-b border-stroke last:border-b-0 dark:border-dark-stroke">
                <td className="px-4 py-3 font-mono text-xs">#{p.id}</td>
                <td className="px-4 py-3 font-bold text-navy dark:text-ivory">
                  {p.predicted_label || p.label}
                </td>
                <td className="px-4 py-3">{Math.round((p.confidence || 0) * 100)}%</td>
                <td className="px-4 py-3">{p.user?.name || p.user_id}</td>
                <td className="px-4 py-3 text-xs">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminPage;
