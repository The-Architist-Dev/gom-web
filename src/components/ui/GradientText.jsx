import React from 'react';

/**
 * GradientText - Animated gradient text component
 * From React Bits
 */
const GradientText = ({
  children,
  colors = ['#5227FF', '#FF9FFC', '#B497CF'],
  animationSpeed = 8,
  showBorder = false,
  className = '',
}) => {
  // Create gradient string
  const gradientColors = [...colors, colors[0]]; // Loop back to first color
  const gradient = gradientColors.join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${gradient})`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `gradient ${animationSpeed}s linear infinite`,
  };

  const borderStyle = showBorder
    ? {
        WebkitTextStroke: '1px rgba(0,0,0,0.1)',
      }
    : {};

  return (
    <>
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% center;
            }
            100% {
              background-position: 200% center;
            }
          }
        `}
      </style>
      <span className={`inline-block ${className}`} style={{ ...gradientStyle, ...borderStyle }}>
        {children}
      </span>
    </>
  );
};

export default GradientText;

