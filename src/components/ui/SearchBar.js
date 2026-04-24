import React from 'react';

export function SearchBar({ value, onChange, placeholder = "Tìm kiếm...", icon = "fas fa-search" }) {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
      <i 
        className={icon}
        style={{ 
          position: 'absolute', 
          left: '24px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          color: 'var(--text-muted)',
          fontSize: '1.1rem'
        }}
      ></i>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ 
          width: '100%', 
          padding: '18px 24px 18px 60px', 
          borderRadius: '50px', 
          border: '2px solid var(--stroke)', 
          background: 'white', 
          fontSize: '1rem', 
          outline: 'none', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--primary)';
          e.target.style.boxShadow = '0 8px 30px rgba(20,44,110,0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--stroke)';
          e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
        }}
      />
    </div>
  );
}
