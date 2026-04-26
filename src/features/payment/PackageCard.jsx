import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MagicPricingCard } from '../../components/ui/MagicPricingCard';
import { ShimmerBadge } from '../../components/ui/ShimmerBadge';
import { ShimmerButton } from '../../components/ui/ShimmerButton';
import { CountUpNumber } from '../../components/ui/CountUpNumber';
import { formatNumber } from '../../lib/utils';

export const PackageCard = ({ pkg, onSelect, selected = false, animatePrice = false }) => {
  const { t } = useTranslation();
  const [priceAnimated, setPriceAnimated] = useState(false);
  const featured = !!pkg.featured || pkg.is_popular;
  const credits = pkg.credits ?? pkg.credit_amount ?? 0;
  const price = pkg.price ?? pkg.amount ?? 0;
  const pricePerCredit = credits > 0 ? Math.round(price / credits) : 0;

  return (
    <MagicPricingCard
      featured={featured}
      selected={selected}
      onClick={() => onSelect(pkg)}
      className="flex flex-col"
    >
      {/* Top section: Label + Badge */}
      <div className="mb-4 flex min-h-[32px] items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-muted dark:text-dark-text-muted">
          {pkg.name}
        </span>
        {pkg.discount && <ShimmerBadge variant="ceramic">{pkg.discount}</ShimmerBadge>}
        {featured && !pkg.discount && <ShimmerBadge variant="ceramic">★ Phổ biến</ShimmerBadge>}
      </div>

      {/* Credits amount */}
      <h3 className="font-heading text-2xl font-extrabold leading-tight text-navy dark:text-ivory md:text-3xl">
        {formatNumber(credits)} {t('payment.credits')}
      </h3>
      
      {/* Price per credit */}
      <p className="mt-2 text-xs font-medium text-muted dark:text-dark-text-muted">
        {t('payment.perCredit', { price: formatNumber(pricePerCredit) })}
      </p>

      {/* Price - with count-up animation */}
      <div className="mt-6 flex items-baseline gap-1.5">
        {animatePrice && !priceAnimated ? (
          <CountUpNumber
            value={price}
            duration={1.2}
            ease="power2.out"
            format={(n) => formatNumber(Math.round(n))}
            className="font-heading text-4xl font-black text-navy dark:text-ivory md:text-5xl"
            onComplete={() => setPriceAnimated(true)}
          />
        ) : (
          <span className="font-heading text-4xl font-black text-navy dark:text-ivory md:text-5xl">
            {formatNumber(price)}
          </span>
        )}
        <span className="text-lg font-bold text-navy dark:text-ivory">đ</span>
      </div>

      {/* Button - aligned at bottom */}
      <div className="mt-8 pt-4">
        <ShimmerButton
          size="lg"
          variant={featured ? 'ceramic' : 'primary'}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg);
          }}
        >
          {t('payment.select')}
        </ShimmerButton>
      </div>
    </MagicPricingCard>
  );
};

export default PackageCard;

