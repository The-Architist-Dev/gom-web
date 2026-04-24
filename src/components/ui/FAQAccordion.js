import React, { useState } from 'react';

export function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            style={{
              border: '2px solid var(--stroke)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--surface)',
              transition: 'all 0.3s ease',
              borderColor: isOpen ? 'var(--primary)' : 'var(--stroke)'
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              style={{
                width: '100%',
                padding: '20px 24px',
                background: isOpen ? 'var(--input-bg)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--primary-dark)',
                flex: 1
              }}>
                {item.q}
              </span>
              <i
                className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--primary)',
                  transition: 'transform 0.3s ease'
                }}
              ></i>
            </button>
            
            <div
              style={{
                maxHeight: isOpen ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}
            >
              <div style={{
                padding: '0 24px 24px 24px',
                fontSize: '0.95rem',
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                fontWeight: 400
              }}>
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
