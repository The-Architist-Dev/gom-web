import React from 'react';

export function FeatureCard({ icon, title, description }) {
  return (
    <div 
      className="card" 
      style={{ 
        padding: '48px 36px', 
        textAlign: 'center', 
        border: '2px solid var(--stroke)', 
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        transition: 'all 0.3s ease',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--stroke)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ 
        width: '88px', 
        height: '88px', 
        background: 'var(--input-bg)', 
        borderRadius: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 28px',
        border: '2px solid var(--stroke)'
      }}>
        <i 
          className={icon} 
          style={{ 
            fontSize: '2.5rem', 
            color: 'var(--primary)'
          }}
        ></i>
      </div>
      
      <h3 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '1.4rem', 
        fontWeight: 700, 
        color: 'var(--primary-dark)', 
        marginBottom: '16px',
        lineHeight: 1.3
      }}>
        {title}
      </h3>
      
      <p style={{ 
        fontSize: '1rem', 
        color: 'var(--text-muted)', 
        lineHeight: 1.7,
        fontWeight: 400
      }}>
        {description}
      </p>
    </div>
  );
}
