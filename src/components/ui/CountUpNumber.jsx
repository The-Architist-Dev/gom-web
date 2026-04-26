import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CountUpNumber - Animated number counter using GSAP
 * Animates from 0 to target value with proper formatting
 */
export const CountUpNumber = ({
  value,
  duration = 1.2,
  ease = 'power2.out',
  format = (n) => n.toLocaleString('vi-VN'),
  className,
  suffix = '',
  onComplete,
}) => {
  const numberRef = useRef(null);
  const tweenRef = useRef(null);

  useEffect(() => {
    if (!numberRef.current) return;

    const obj = { val: 0 };
    
    tweenRef.current = gsap.to(obj, {
      val: value,
      duration,
      ease,
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = format(Math.round(obj.val));
        }
      },
      onComplete: () => {
        if (numberRef.current) {
          numberRef.current.textContent = format(value);
        }
        onComplete?.();
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [value, duration, ease, format, onComplete]);

  return (
    <span className={className}>
      <span ref={numberRef}>0</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
};

export default CountUpNumber;
