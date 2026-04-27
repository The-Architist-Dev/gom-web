import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export const PLACEHOLDER_CERAMIC = '/placeholder-ceramic.svg';

/**
 * <ImageWithFallback /> — drop-in <img> replacement that:
 * - Resets internal "error" state whenever `src` changes (fixes stale-error bug
 *   when reusing the same component for a new item, e.g. prediction detail modal).
 * - Falls back to a clean ceramic-themed SVG placeholder instead of the browser's
 *   broken-image glyph.
 * - Treats empty/null src as "no image" → renders the placeholder directly.
 */
export const ImageWithFallback = ({
  src,
  alt = '',
  className,
  fallbackSrc = PLACEHOLDER_CERAMIC,
  imgClassName,
  ...rest
}) => {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  const finalSrc = !src || errored ? fallbackSrc : src;
  const isFallback = finalSrc === fallbackSrc;

  return (
    <img
      src={finalSrc}
      alt={alt}
      onError={() => {
        if (!errored) setErrored(true);
      }}
      loading="lazy"
      decoding="async"
      className={cn(
        isFallback ? 'object-contain bg-gray-100 dark:bg-gray-800' : 'object-cover',
        className,
        imgClassName
      )}
      {...rest}
    />
  );
};

export default ImageWithFallback;
