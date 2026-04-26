import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * MagicPricingCard - React Bits style card with spotlight glow effect
 * Features: mouse-tracking glow, hover lift, selected state with check badge
 */
export const MagicPricingCard = ({
  children,
  featured = false,
  selected = false,
  onClick,
  className,
}) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative overflow-hidden rounded-[28px] bg-surface p-8 shadow-sm transition-shadow duration-300 cursor-pointer',
        'dark:bg-dark-surface',
        featured && 'border-2 border-gold ring-2 ring-gold/20',
        !featured && 'border border-stroke dark:border-dark-stroke',
        selected && 'border-2 border-navy ring-2 ring-navy/20 dark:border-gold dark:ring-gold/20',
        isHovered && 'shadow-xl',
        className
      )}
    >
      {/* Spotlight glow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.15 : 0,
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${
              featured ? 'rgba(212, 175, 55, 0.4)' : 'rgba(15, 38, 92, 0.3)'
            }, transparent 40%)`,
          }}
        />
      )}

      {/* Shine sweep on selection */}
      {selected && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ width: '50%' }}
        />
      )}

      {/* Selected check badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white dark:bg-gold dark:text-navy-dark"
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
};

export default MagicPricingCard;
