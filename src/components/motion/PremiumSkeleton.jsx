import React from 'react';
import { cn } from '../../lib/utils';

/**
 * PremiumSkeleton — shimmer skeleton loading placeholder.
 */
export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => (
  <div
    className={cn(
      'relative overflow-hidden bg-surface-alt dark:bg-dark-surface-alt',
      rounded,
      className
    )}
  >
    <div
      className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
      style={{ backgroundSize: '200% 100%' }}
    />
  </div>
);

/**
 * CardSkeleton — full card shimmer.
 */
export const CardSkeleton = ({ imageRatio = '4/3' }) => (
  <div className="overflow-hidden rounded-2xl border border-stroke bg-surface dark:border-dark-stroke dark:bg-dark-surface">
    <Skeleton className="w-full" style={{ aspectRatio: imageRatio }} rounded="rounded-none" />
    <div className="space-y-3 p-5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  </div>
);

/**
 * TableRowSkeleton — row placeholder for tables.
 */
export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4" style={{ width: `${60 + Math.random() * 30}%` }} />
      </td>
    ))}
  </tr>
);

export const PremiumSkeleton = Skeleton;
export default Skeleton;
