import React from 'react';

export function PageHeader({ eyebrow, title, subtitle, icon }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '64px', paddingTop: '40px' }}>
      {eyebrow && (
        <div style={{ 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          color: 'var(--accent)', 
          textTransform: 'uppercase', 
          letterSpacing: '2.5px', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {icon && <i className={icon} style={{ fontSize: '1rem' }}></i>}
          {eyebrow}
        </div>
      )}
      <h2 
        className="display-title" 
        style={{ 
          fontSize: '2.8rem', 
          maxWidth: '900px', 
          margin: '0 auto 24px', 
          lineHeight: 1.2,
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          color: 'var(--primary-dark)'
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className="subtitle" 
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto',
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.7
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
