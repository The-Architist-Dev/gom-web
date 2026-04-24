import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import './AnimatedToast.css';

export const AnimatedToast = ({ notification }) => {
  if (!notification) return null;

  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    info: <Info size={24} />
  };

  const titles = {
    success: 'Thành công',
    error: 'Lỗi hệ thống',
    info: 'Thông báo'
  };

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className={`animated-toast animated-toast-${notification.type}`}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <div className="animated-toast-icon">
            {icons[notification.type] || icons.info}
          </div>
          <div className="animated-toast-content">
            <div className="animated-toast-title">
              {titles[notification.type] || titles.info}
            </div>
            <div className="animated-toast-message">
              {notification.message}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
