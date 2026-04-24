import React from 'react';

export function PageSection({ children, className = '', style = {} }) {
  return (
    <section 
      className={`page-section ${className}`}
      style={{
        marginBottom: '80px',
        ...style
      }}
    >
      {children}
    </section>
  );
}
