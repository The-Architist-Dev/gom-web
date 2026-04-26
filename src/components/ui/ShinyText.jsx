import React, { useEffect, useRef } from 'react';

/**
 * ShinyText - Animated shiny text effect
 * From React Bits
 */
const ShinyText = ({
  text,
  speed = 2,
  delay = 0,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  disabled = false,
  className = '',
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (disabled || !textRef.current) return;

    const element = textRef.current;
    const animationDuration = speed * 1000;
    const spreadDeg = spread;

    // Create gradient
    const gradient = `linear-gradient(
      ${direction === 'left' ? '90deg' : direction === 'right' ? '-90deg' : '0deg'},
      ${color} 0%,
      ${color} ${50 - spreadDeg / 2}%,
      ${shineColor} 50%,
      ${color} ${50 + spreadDeg / 2}%,
      ${color} 100%
    )`;

    element.style.background = gradient;
    element.style.backgroundSize = '200% auto';
    element.style.WebkitBackgroundClip = 'text';
    element.style.WebkitTextFillColor = 'transparent';
    element.style.backgroundClip = 'text';

    // Animation
    const keyframes = yoyo
      ? `
        @keyframes shiny-text-yoyo {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }
      `
      : `
        @keyframes shiny-text {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `;

    // Inject keyframes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    // Apply animation
    const animationName = yoyo ? 'shiny-text-yoyo' : 'shiny-text';
    element.style.animation = `${animationName} ${animationDuration}ms linear ${delay}ms infinite`;

    if (pauseOnHover) {
      element.addEventListener('mouseenter', () => {
        element.style.animationPlayState = 'paused';
      });
      element.addEventListener('mouseleave', () => {
        element.style.animationPlayState = 'running';
      });
    }

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [speed, delay, color, shineColor, spread, direction, yoyo, pauseOnHover, disabled]);

  if (disabled) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={textRef} className={`inline-block ${className}`}>
      {text}
    </span>
  );
};

export default ShinyText;
