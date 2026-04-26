import React, { useEffect, useRef } from 'react';

/**
 * ShinyText - Animated shiny text effect with dark mode support
 * From React Bits
 */
const ShinyText = ({
  text,
  speed = 2,
  delay = 0,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  darkColor = null,
  darkShineColor = null,
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

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark');
    const finalColor = isDark && darkColor ? darkColor : color;
    const finalShineColor = isDark && darkShineColor ? darkShineColor : shineColor;

    // Create gradient
    const gradient = `linear-gradient(
      ${direction === 'left' ? '90deg' : direction === 'right' ? '-90deg' : '0deg'},
      ${finalColor} 0%,
      ${finalColor} ${50 - spreadDeg / 2}%,
      ${finalShineColor} 50%,
      ${finalColor} ${50 + spreadDeg / 2}%,
      ${finalColor} 100%
    )`;

    element.style.background = gradient;
    element.style.backgroundSize = '200% auto';
    element.style.WebkitBackgroundClip = 'text';
    element.style.WebkitTextFillColor = 'transparent';
    element.style.backgroundClip = 'text';

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains('dark');
      const newColor = isDarkNow && darkColor ? darkColor : color;
      const newShineColor = isDarkNow && darkShineColor ? darkShineColor : shineColor;
      
      const newGradient = `linear-gradient(
        ${direction === 'left' ? '90deg' : direction === 'right' ? '-90deg' : '0deg'},
        ${newColor} 0%,
        ${newColor} ${50 - spreadDeg / 2}%,
        ${newShineColor} 50%,
        ${newColor} ${50 + spreadDeg / 2}%,
        ${newColor} 100%
      )`;
      element.style.background = newGradient;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

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
      observer.disconnect();
    };
  }, [speed, delay, color, shineColor, darkColor, darkShineColor, spread, direction, yoyo, pauseOnHover, disabled]);

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
