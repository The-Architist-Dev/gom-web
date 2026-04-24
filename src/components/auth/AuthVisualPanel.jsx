import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap } from 'lucide-react';
import './AuthVisualPanel.css';

export const AuthVisualPanel = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div 
      className="auth-visual-panel"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="decoration-1 auth-visual-decoration" 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.img 
        src="/logo.png" 
        alt="The Archivist" 
        className="auth-visual-logo"
        variants={itemVariants}
      />
      
      <motion.h1 className="auth-visual-title" variants={itemVariants}>
        The Archivist
      </motion.h1>
      
      <motion.p className="auth-visual-subtitle" variants={itemVariants}>
        Hệ thống giám định gốm sứ cổ thông minh
      </motion.p>
      
      <motion.p className="auth-visual-tagline" variants={itemVariants}>
        AI-Powered Ceramic Authentication Archive
      </motion.p>

      <motion.div className="auth-visual-features" variants={containerVariants}>
        <motion.div className="auth-visual-feature" variants={itemVariants}>
          <div className="auth-visual-feature-icon">
            <Sparkles size={24} />
          </div>
          <div className="auth-visual-feature-text">
            <div className="auth-visual-feature-title">Trí tuệ nhân tạo đa đại lý</div>
            <div className="auth-visual-feature-desc">
              Phân tích chính xác nguồn gốc và niên đại cổ vật
            </div>
          </div>
        </motion.div>

        <motion.div className="auth-visual-feature" variants={itemVariants}>
          <div className="auth-visual-feature-icon">
            <Shield size={24} />
          </div>
          <div className="auth-visual-feature-text">
            <div className="auth-visual-feature-title">Bảo tồn di sản văn hóa</div>
            <div className="auth-visual-feature-desc">
              Lưu trữ và bảo vệ kiến thức gốm sứ truyền thống
            </div>
          </div>
        </motion.div>

        <motion.div className="auth-visual-feature" variants={itemVariants}>
          <div className="auth-visual-feature-icon">
            <Zap size={24} />
          </div>
          <div className="auth-visual-feature-text">
            <div className="auth-visual-feature-title">Giám định nhanh chóng</div>
            <div className="auth-visual-feature-desc">
              Kết quả chi tiết chỉ trong vài giây
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="decoration-2 auth-visual-decoration"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </motion.div>
  );
};
