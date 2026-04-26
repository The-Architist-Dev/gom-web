import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plus, User, CreditCard, FileText, LogOut, Shield, ChevronDown, Zap, Gift } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeToggle } from '../../theme/ThemeToggle';
import { cn } from '../../lib/utils';

export const MainHeader = ({ user, quota, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const badgeRef = useRef(null);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/ceramics', label: t('nav.lines') },
    { path: '/history', label: t('nav.history') },
    { path: '/contact', label: t('nav.contact') },
    { path: '/about', label: t('nav.about') },
  ];

  // Check if current path matches nav item
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!showDropdown && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (!showDropdown) return;
    const handler = () => setShowDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  const remainingFree = Math.max(0, (quota?.free_limit ?? 0) - (quota?.free_used ?? 0));
  const tokenBalance = quota?.token_balance ?? 0;
  const noQuota = remainingFree <= 0 && tokenBalance <= 0;

  return (
    <header className="sticky top-0 z-40 border-b border-stroke/60 bg-ivory/85 backdrop-blur-md dark:border-dark-stroke dark:bg-dark-bg/85">
      <div className="mx-auto flex h-16 max-w-content items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          <img src="/logo.png" alt="The Archivist" className="h-9 w-9 object-contain" />
          <span className="hidden font-heading text-lg font-bold text-navy dark:text-ivory sm:inline">
            The Archivist
          </span>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden flex-1 justify-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-bold transition-all',
                isActive(item.path)
                  ? 'bg-navy text-white dark:bg-gold dark:text-navy-dark'
                  : 'text-muted hover:bg-surface-alt hover:text-navy dark:text-dark-text-muted dark:hover:bg-dark-surface-alt dark:hover:text-ivory'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          {/* Quota */}
          <div className="hidden items-center gap-1 md:flex">
            {tokenBalance > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-gold-dark">
                <Zap size={12} />
                {tokenBalance}
              </span>
            )}
            {remainingFree > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                <Gift size={12} />
                {remainingFree}
              </span>
            )}
            {noQuota && (
              <span className="rounded-full bg-danger/15 px-2.5 py-1 text-xs font-bold text-danger">
                {t('header.noQuota')}
              </span>
            )}
          </div>

          {/* Top up CTA */}
          <Link
            to="/payment"
            className="hidden items-center gap-1.5 rounded-full bg-gradient-gold px-4 py-2 text-xs font-extrabold text-navy-dark shadow-sm transition-all hover:shadow-glow active:scale-95 sm:inline-flex"
          >
            <Plus size={14} strokeWidth={3} />
            <span>{t('header.topupShort')}</span>
          </Link>

          {/* Theme */}
          <ThemeToggle />

          {/* Language */}
          <LanguageToggle className="hidden md:inline-flex" />

          {/* Avatar */}
          <button
            ref={badgeRef}
            type="button"
            onClick={toggleDropdown}
            className="flex items-center gap-2 rounded-full border border-stroke bg-surface px-1.5 py-1.5 transition-colors hover:bg-surface-alt dark:border-dark-stroke dark:bg-dark-surface dark:hover:bg-dark-surface-alt"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" />
            <ChevronDown size={14} className="mr-1 text-muted dark:text-dark-text-muted" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex justify-center gap-1 overflow-x-auto border-t border-stroke/60 px-4 py-2 lg:hidden dark:border-dark-stroke">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-all',
              isActive(item.path)
                ? 'bg-navy text-white dark:bg-gold dark:text-navy-dark'
                : 'text-muted hover:bg-surface-alt dark:text-dark-text-muted dark:hover:bg-dark-surface-alt'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Dropdown */}
      {showDropdown &&
        createPortal(
          <div
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] w-60 origin-top-right animate-fade-in rounded-2xl border border-stroke bg-surface p-2 shadow-lg dark:border-dark-stroke dark:bg-dark-surface"
            style={{ top: dropdownPos.top, right: dropdownPos.right }}
          >
            <div className="mb-2 border-b border-stroke px-3 py-2 dark:border-dark-stroke">
              <p className="truncate text-sm font-bold text-navy dark:text-ivory">{user?.name}</p>
              <p className="truncate text-xs text-muted dark:text-dark-text-muted">{user?.email}</p>
            </div>

            <DropdownItem
              icon={<User size={16} />}
              label={t('header.myProfile')}
              onClick={() => {
                navigate('/profile');
                setShowDropdown(false);
              }}
            />
            <DropdownItem
              icon={<FileText size={16} />}
              label={t('header.transactionHistory')}
              onClick={() => {
                navigate('/transactions');
                setShowDropdown(false);
              }}
            />
            <DropdownItem
              icon={<CreditCard size={16} />}
              label={t('header.topup')}
              onClick={() => {
                navigate('/payment');
                setShowDropdown(false);
              }}
            />

            {user?.role === 'admin' && (
              <>
                <div className="my-2 h-px bg-stroke dark:bg-dark-stroke" />
                <DropdownItem
                  icon={<Shield size={16} />}
                  label={t('nav.admin')}
                  variant="gold"
                  onClick={() => {
                    navigate('/admin');
                    setShowDropdown(false);
                  }}
                />
              </>
            )}

            <div className="my-2 h-px bg-stroke dark:bg-dark-stroke" />
            <DropdownItem
              icon={<LogOut size={16} />}
              label={t('nav.logout')}
              variant="danger"
              onClick={async () => {
                setShowDropdown(false);
                await logout();
                navigate('/auth');
              }}
            />
          </div>,
          document.body
        )}
    </header>
  );
};

const DropdownItem = ({ icon, label, onClick, variant = 'default' }) => {
  const cls = {
    default: 'text-navy hover:bg-surface-alt dark:text-dark-text dark:hover:bg-dark-surface-alt',
    gold: 'text-gold-dark hover:bg-gold/10',
    danger: 'text-danger hover:bg-danger/10',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors', cls)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default MainHeader;
