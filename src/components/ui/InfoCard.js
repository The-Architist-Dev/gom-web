import React from 'react';

export function InfoCard({ icon, title, content, subtitle }) {
  return (
    <div 
      className="card" 
      style={{ 
        textAlign: 'center', 
        padding: '40px 32px', 
        border: '2px solid var(--stroke)', 
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--stroke)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ 
        width: '72px', 
        height: '72px', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', 
        borderRadius: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '0 auto 24px',
        boxShadow: '0 8px 20px rgba(20,44,110,0.2)'
      }}>
        <i 
          className={icon} 
          style={{ 
            fontSize: '2rem', 
            color: 'var(--accent)'
          }}
        ></i>
      </div>
      
      <h4 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        color: 'var(--primary-dark)', 
        marginBottom: '12px' 
      }}>
        {title}
      </h4>
      
      <p style={{ 
        fontSize: '1.05rem', 
        color: 'var(--text-main)', 
        fontWeight: 600,
        marginBottom: subtitle ? '8px' : 0
      }}>
        {content}
      </p>
      
      {subtitle && (
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-muted)',
          fontWeight: 500
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
