import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * CountUpNumber — animated number that counts up when in view.
 */
export const CountUpNumber = ({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  separator = ',',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp
          start={start}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator={separator}
        />
      ) : (
        `${prefix}${start}${suffix}`
      )}
    </span>
  );
};

export default CountUpNumber;

