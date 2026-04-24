import React from 'react';
import { motion } from 'framer-motion';
import './PremiumInput.css';

export const PremiumInput = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  icon,
  rightElement
}) => {
  return (
    <motion.div 
      className="premium-input-group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="premium-input-label">{label}</label>
      <div className="premium-input-wrapper">
        {icon && <div className="premium-input-icon">{icon}</div>}
        <input
          className="premium-input-field"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightElement && <div className="premium-input-right">{rightElement}</div>}
      </div>
    </motion.div>
  );
};
