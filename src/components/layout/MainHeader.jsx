import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PillNav from '../ui/PillNav';
import { Plus, User, CreditCard, FileText, LogOut, Shield } from 'lucide-react';
import './MainHeader.css';

export const MainHeader = ({ user, quota, view, setView, logout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const badgeRef = useRef(null);

  const navItems = [
    { id: 'debate', label: 'Trang chủ' },
    { id: 'lines', label: 'Dòng gốm' },
    { id: 'history', label: 'Lịch sử' },
    { id: 'contact', label: 'Liên hệ' },
    { id: 'about', label: 'Về chúng tôi' },
  ];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!showDropdown && badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 10, right: window.innerWidth - rect.right });
    }
    setShowDropdown(prev => !prev);
  };

  useEffect(() => {
    if (!showDropdown) return;
    const handler = () => setShowDropdown(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showDropdown]);

  const handleNavClick = (itemId) => {
    setView(itemId);
    window.location.hash = itemId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="main-header-premium">
      <div className="main-header-container">
        {/* Logo Area - Separate from PillNav */}
        <div 
          className="main-header-logo-area"
          onClick={() => handleNavClick('debate')}
        >
          <img 
            src="/logo.png" 
            alt="The Archivist" 
            className="main-header-logo-image"
          />
        </div>

        {/* React Bits Pill Nav */}
        <div className="main-header-nav-wrapper">
          <PillNav
            items={navItems}
            activeHref={view}
            onItemClick={handleNavClick}
            baseColor="#0F265C"
            pillColor="#F7F1E8"
            hoveredPillTextColor="#F7F1E8"
            pillTextColor="#0F265C"
            initialLoadAnimation={false}
          />
        </div>

        {/* User Actions Cluster */}
        <div className="main-header-actions-cluster">
          {/* Quota Display */}
          <div className="quota-compact">
            {quota.token_balance > 0 && (
              <div className="quota-item paid">
                <span className="quota-icon">⚡</span>
                <span className="quota-value">{quota.token_balance}</span>
              </div>
            )}
            {quota.free_used < quota.free_limit && (
              <div className="quota-item free">
                <span className="quota-icon">🎁</span>
                <span className="quota-value">{quota.free_limit - quota.free_used}</span>
              </div>
            )}
            {quota.free_used >= quota.free_limit && quota.token_balance <= 0 && (
              <div className="quota-item empty">Hết lượt</div>
            )}
          </div>

          {/* Payment CTA */}
          <button 
            className="btn-topup-premium"
            onClick={() => setView('payment')}
          >
            <Plus size={16} strokeWidth={3} />
            <span>Nạp lượt</span>
          </button>

          {/* User Badge */}
          <div
            ref={badgeRef}
            className="user-badge-premium"
            onClick={toggleDropdown}
          >
            <div className="user-avatar-premium">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="user-chevron-premium">▼</span>
          </div>
        </div>
      </div>

      {/* Dropdown Portal */}
      {showDropdown && createPortal(
        <div
          className="user-dropdown"
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            right: dropdownPos.right,
            zIndex: 9999,
          }}
        >
          <div className="dropdown-item" onClick={() => { setView('profile'); setShowDropdown(false); }}>
            <User size={16} />
            <span>Hồ sơ của tôi</span>
          </div>
          <div className="dropdown-item" onClick={() => { setView('transaction_history'); setShowDropdown(false); }}>
            <FileText size={16} />
            <span>Lịch sử giao dịch</span>
          </div>
          <div className="dropdown-item" onClick={() => { setView('payment'); setShowDropdown(false); }}>
            <CreditCard size={16} />
            <span>Nạp lượt phân tích</span>
          </div>
          {user?.role === 'admin' && (
            <>
              <div className="dropdown-divider" />
              <div className="dropdown-item admin" onClick={() => { setView('admin_dashboard'); setShowDropdown(false); }}>
                <Shield size={16} />
                <span>Khu vực Admin</span>
              </div>
            </>
          )}
          <div className="dropdown-divider" />
          <div className="dropdown-item danger" onClick={() => { logout(); setShowDropdown(false); }}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
