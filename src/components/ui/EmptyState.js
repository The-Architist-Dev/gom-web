import React from 'react';

export function EmptyState({ 
  icon = "fas fa-folder-open", 
  title = "Không tìm thấy kết quả", 
  subtitle = "Thử điều chỉnh bộ lọc hoặc tìm kiếm khác",
  actions = []
}) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 40px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        background: 'var(--input-bg)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 32px',
        border: '3px solid var(--stroke)'
      }}>
        <i 
          className={icon} 
          style={{ 
            fontSize: '3rem', 
            color: 'var(--text-muted)',
            opacity: 0.5
          }}
        ></i>
      </div>
      
      <h3 style={{ 
        fontFamily: 'var(--font-heading)', 
        fontSize: '1.8rem', 
        fontWeight: 700, 
        color: 'var(--primary-dark)', 
        marginBottom: '16px' 
      }}>
        {title}
      </h3>
      
      <p style={{ 
        fontSize: '1rem', 
        color: 'var(--text-muted)', 
        marginBottom: '40px',
        lineHeight: 1.6
      }}>
        {subtitle}
      </p>
      
      {actions.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={action.primary ? 'btn btn-primary' : 'btn btn-outline'}
              style={{
                padding: '14px 32px',
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {action.icon && <i className={action.icon}></i>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
