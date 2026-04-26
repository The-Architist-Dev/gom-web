import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Stepper = ({ steps, current = 0, className }) => (
  <div className={cn('flex flex-wrap items-center justify-center gap-3 md:gap-4', className)}>
    {steps.map((s, i) => {
      const done = i < current;
      const active = i <= current;
      return (
        <React.Fragment key={s.id ?? i}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold transition-colors',
                active
                  ? 'bg-navy text-white dark:bg-gold dark:text-navy-dark'
                  : 'bg-stroke text-muted dark:bg-dark-stroke dark:text-dark-text-muted'
              )}
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-extrabold uppercase tracking-wider',
                active
                  ? 'text-navy dark:text-ivory'
                  : 'text-muted dark:text-dark-text-muted'
              )}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="h-px w-8 bg-stroke dark:bg-dark-stroke md:w-10" />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

export default Stepper;
