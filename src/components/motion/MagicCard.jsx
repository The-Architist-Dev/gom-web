import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * MagicCard — card with radial spotlight that follows the mouse.
 * On mobile, renders as a regular card (no spotlight).
 */
export const MagicCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(212,175,55,0.12)',
  onClick,
  hoverable = true,
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--x', '-9999px');
    cardRef.current.style.setProperty('--y', '-9999px');
  }, []);

  return (
    <motion.div
      ref={cardRef}
      whileHover={hoverable ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-stroke bg-surface shadow-sm',
        'dark:border-dark-stroke dark:bg-dark-surface',
        'transition-shadow duration-300',
        hoverable && 'cursor-pointer hover:shadow-md',
        className
      )}
      style={{
        '--x': '-9999px',
        '--y': '-9999px',
      }}
    >
      {/* Spotlight overlay */}
      <span
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at var(--x) var(--y), ${spotlightColor}, transparent 70%)`,
          opacity: 1,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default MagicCard;
