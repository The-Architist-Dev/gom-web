import React from 'react';
import { cn } from '../../lib/utils';

const variants = {
  primary:
    'bg-navy text-white hover:bg-navy-light hover:shadow-lg active:scale-[0.98] dark:bg-gold dark:text-navy-dark dark:hover:bg-gold-light',
  secondary:
    'bg-surface-alt text-navy hover:bg-stroke active:scale-[0.98] dark:bg-dark-surface-alt dark:text-dark-text dark:hover:bg-dark-stroke',
  ghost:
    'bg-transparent text-navy hover:bg-surface-alt dark:text-dark-text dark:hover:bg-dark-surface-alt',
  outline:
    'border border-stroke bg-transparent text-navy hover:bg-surface-alt dark:border-dark-stroke dark:text-dark-text dark:hover:bg-dark-surface-alt',
  danger: 'bg-danger text-white hover:bg-danger/90 active:scale-[0.98]',
  gold: 'bg-gradient-gold text-navy-dark hover:shadow-glow active:scale-[0.98]',
  link: 'bg-transparent text-navy underline-offset-4 hover:underline px-0 py-0 dark:text-gold',
};

const sizes = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-5 text-sm rounded-xl',
  lg: 'h-14 px-8 text-base rounded-2xl',
  xl: 'h-16 px-10 text-base rounded-2xl',
  icon: 'h-10 w-10 rounded-full',
};

export const Button = React.forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    loading,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
