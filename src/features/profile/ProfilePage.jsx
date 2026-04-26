import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input, Label } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { profileApi } from './api';
import { cn, getErrorMessage } from '../../lib/utils';

const TABS = [
  { id: 'info', icon: User },
  { id: 'password', icon: Lock },
];

export const ProfilePage = ({ user, fetchUser, notify }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onPwdChange = (e) => setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submitInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileApi.update({ name: form.name, phone: form.phone });
      await fetchUser?.();
      notify?.(t('profile.saved'), 'success');
    } catch (err) {
      notify?.(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const submitPwd = async (e) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) {
      notify?.(t('auth.passwordMismatch'), 'error');
      return;
    }
    if (pwd.next.length < 6) {
      notify?.(t('errors.validation'), 'error');
      return;
    }
    setChanging(true);
    try {
      await profileApi.changePassword({
        current_password: pwd.current,
        new_password: pwd.next,
        new_password_confirmation: pwd.confirm,
      });
      setPwd({ current: '', next: '', confirm: '' });
      notify?.(t('profile.passwordChanged'), 'success');
    } catch (err) {
      notify?.(getErrorMessage(err), 'error');
    } finally {
      setChanging(false);
    }
  };

  const remainingFree = Math.max(0, (user?.free_limit ?? 0) - (user?.free_used ?? 0));

  return (
    <PageContainer narrow>
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <Card>
        <div className="mb-8 flex flex-col items-center gap-4 border-b border-stroke pb-8 text-center dark:border-dark-stroke md:flex-row md:items-start md:text-left">
          <Avatar src={user?.avatar} name={user?.name} size="xl" />
          <div className="flex-1">
            <h3 className="font-heading text-2xl font-bold text-navy dark:text-ivory">
              {user?.name}
            </h3>
            <p className="text-sm text-muted dark:text-dark-text-muted">{user?.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {user?.role === 'admin' && <Badge variant="gold">Admin</Badge>}
              <Badge variant="info">
                {user?.token_balance ?? 0} {t('payment.credits')}
              </Badge>
              <Badge variant="success">
                {remainingFree} {t('header.freeQuota')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 border-b border-stroke dark:border-dark-stroke">
          {TABS.map((t2) => (
            <button
              key={t2.id}
              type="button"
              onClick={() => setTab(t2.id)}
              className={cn(
                '-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors',
                tab === t2.id
                  ? 'border-ceramic text-navy dark:text-ivory'
                  : 'border-transparent text-muted hover:text-navy dark:text-dark-text-muted dark:hover:text-ivory'
              )}
            >
              <t2.icon size={16} />
              {t('profile.tabs.' + t2.id)}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <form onSubmit={submitInfo} className="space-y-4">
            <div>
              <Label>{t('profile.fields.name')}</Label>
              <Input name="name" value={form.name} onChange={onChange} leftIcon={<User size={16} />} required />
            </div>
            <div>
              <Label>{t('profile.fields.email')}</Label>
              <Input name="email" type="email" value={form.email} disabled leftIcon={<Mail size={16} />} />
            </div>
            <div>
              <Label>{t('profile.fields.phone')}</Label>
              <Input name="phone" value={form.phone} onChange={onChange} leftIcon={<Phone size={16} />} />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={saving}
              leftIcon={!saving && <Save size={16} />}
            >
              {saving ? t('common.saving') : t('profile.save')}
            </Button>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={submitPwd} className="space-y-4">
            <div>
              <Label>{t('profile.fields.currentPassword')}</Label>
              <Input
                name="current"
                type="password"
                value={pwd.current}
                onChange={onPwdChange}
                leftIcon={<Lock size={16} />}
                required
              />
            </div>
            <div>
              <Label>{t('profile.fields.newPassword')}</Label>
              <Input
                name="next"
                type="password"
                value={pwd.next}
                onChange={onPwdChange}
                leftIcon={<Lock size={16} />}
                required
                minLength={6}
              />
            </div>
            <div>
              <Label>{t('profile.fields.confirmPassword')}</Label>
              <Input
                name="confirm"
                type="password"
                value={pwd.confirm}
                onChange={onPwdChange}
                leftIcon={<Lock size={16} />}
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={changing}
              leftIcon={!changing && <Save size={16} />}
            >
              {changing ? t('common.saving') : t('profile.save')}
            </Button>
          </form>
        )}
      </Card>
    </PageContainer>
  );
};

export default ProfilePage;

