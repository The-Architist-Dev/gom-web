import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '../../lib/utils';

/**
 * AnimatedStepper - Enhanced stepper with GSAP animations
 * Features: progress line fill, step transitions, completed state animations
 */
export const AnimatedStepper = ({ steps, current = 0, className }) => {
  const lineRefs = useRef([]);
  const stepRefs = useRef([]);
  const prevCurrentRef = useRef(current);

  useEffect(() => {
    const prevCurrent = prevCurrentRef.current;
    
    // Animate step transitions
    if (current !== prevCurrent) {
      // Animate completed step
      if (prevCurrent < steps.length && stepRefs.current[prevCurrent]) {
        gsap.to(stepRefs.current[prevCurrent], {
          scale: 1.15,
          duration: 0.3,
          ease: 'back.out(2)',
          yoyo: true,
          repeat: 1,
        });
      }

      // Animate new active step
      if (current < steps.length && stepRefs.current[current]) {
        gsap.fromTo(
          stepRefs.current[current],
          { scale: 0.8, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          }
        );
      }

      // Animate progress line
      if (current > prevCurrent && lineRefs.current[prevCurrent]) {
        const line = lineRefs.current[prevCurrent];
        const fill = line.querySelector('.line-fill');
        if (fill) {
          gsap.fromTo(
            fill,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.5,
              ease: 'power2.out',
            }
          );
        }
      }
    }

    prevCurrentRef.current = current;
  }, [current, steps.length]);

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3 md:gap-4', className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i <= current;
        
        return (
          <React.Fragment key={s.id ?? i}>
            <div className="flex items-center gap-2">
              <div
                ref={(el) => (stepRefs.current[i] = el)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300',
                  active
                    ? 'bg-navy text-white shadow-md dark:bg-gold dark:text-navy-dark'
                    : 'bg-stroke text-muted dark:bg-dark-stroke dark:text-dark-text-muted'
                )}
              >
                {done ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-extrabold uppercase tracking-wider transition-colors duration-300',
                  active
                    ? 'text-navy dark:text-ivory'
                    : 'text-muted dark:text-dark-text-muted'
                )}
              >
                {s.label}
              </span>
            </div>
            
            {i < steps.length - 1 && (
              <div
                ref={(el) => (lineRefs.current[i] = el)}
                className="relative h-0.5 w-12 overflow-hidden rounded-full bg-stroke dark:bg-dark-stroke md:w-16"
              >
                {done && (
                  <div
                    className="line-fill absolute inset-0 origin-left bg-navy dark:bg-gold"
                    style={{ transform: 'scaleX(1)' }}
                  />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AnimatedStepper;
