import React from 'react';
import { motion } from 'framer-motion';
import './PremiumButton.css';

export const PremiumButton = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary",
  loading = false,
  disabled = false,
  icon
}) => {
  const className = `premium-button premium-button-${variant} ${loading ? 'premium-button-loading' : ''}`;
  
  return (
    <motion.button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
    >
      {loading ? (
        <>
          <div className="premium-button-spinner" />
          Đang xử lý...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};
