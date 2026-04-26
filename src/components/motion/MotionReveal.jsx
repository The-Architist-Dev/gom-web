import React from 'react';
import { motion } from 'framer-motion';

/**
 * MotionReveal — fade-up + blur-to-clear on scroll-into-view.
 * Respects prefers-reduced-motion via Framer Motion defaults.
 */
export const MotionReveal = ({
  children,
  delay = 0,
  duration = 0.6,
  once = true,
  className = '',
  as: Tag = 'div',
}) => {
  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

/**
 * MotionRevealGroup — stagger children on reveal.
 */
export const MotionRevealGroup = ({ children, stagger = 0.1, className = '' }) => {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <MotionReveal key={i} delay={i * stagger}>
          {child}
        </MotionReveal>
      ))}
    </div>
  );
};

export default MotionReveal;

