import React from 'react';
import { motion } from 'framer-motion';
import { AuthBackground } from './AuthBackground';
import { AuthVisualPanel } from './AuthVisualPanel';
import { AuthPanel } from './AuthPanel';
import './AuthShell.css';

export const AuthShell = ({ 
  setToken, 
  setUser, 
  notify, 
  subView, 
  setSubView, 
  resetEmail, 
  setResetEmail 
}) => {
  return (
    <div className="auth-shell">
      <AuthBackground />
      
      <motion.div 
        className="auth-shell-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AuthVisualPanel />
        
        <div className="auth-shell-form-container">
          <AuthPanel
            setToken={setToken}
            setUser={setUser}
            notify={notify}
            subView={subView}
            setSubView={setSubView}
            resetEmail={resetEmail}
            setResetEmail={setResetEmail}
          />
        </div>
      </motion.div>
    </div>
  );
};
