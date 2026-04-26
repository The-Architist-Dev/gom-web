import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * ShimmerButton — button with shimmer sweep + tap scale.
 */
export const ShimmerButton = ({
  children,
  className = '',
  variant = 'gold',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  leftIcon,
  rightIcon,
  loading = false,
}) => {
  const sizeMap = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  const variantMap = {
    gold: 'bg-gradient-gold text-navy-dark dark:text-navy-dark',
    navy: 'bg-navy text-white dark:bg-navy-light',
    ghost: 'bg-transparent border border-stroke text-navy dark:text-ivory dark:border-dark-stroke',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden',
        'rounded-full font-semibold leading-button transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeMap[size],
        variantMap[variant],
        className
      )}
    >
      {/* Shimmer sweep */}
      {!disabled && !loading && (
        <motion.span
          className="pointer-events-none absolute inset-0"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          }}
        />
      )}

      {loading ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="relative z-10">{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default ShimmerButton;

