import React from 'react';
import { cn } from '../../lib/utils';

export const PageHeader = ({ eyebrow, title, subtitle, actions, className, centered = false }) => (
  <div
    className={cn(
      'mb-10 flex flex-col gap-2',
      centered ? 'items-center text-center' : 'items-start',
      'md:mb-14',
      className
    )}
  >
    {eyebrow && (
      <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">
        {eyebrow}
      </span>
    )}
    <h2 className="font-heading text-3xl font-extrabold text-navy dark:text-ivory md:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          'max-w-2xl text-base leading-relaxed text-muted dark:text-dark-text-muted',
          centered && 'mx-auto text-center'
        )}
      >
        {subtitle}
      </p>
    )}
    {actions && <div className="mt-3">{actions}</div>}
  </div>
);

export default PageHeader;
