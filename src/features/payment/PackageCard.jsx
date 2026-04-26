import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { cn, formatNumber } from '../../lib/utils';

export const PackageCard = ({ pkg, onSelect }) => {
  const { t } = useTranslation();
  const featured = !!pkg.featured || pkg.is_popular;
  const credits = pkg.credits ?? pkg.credit_amount ?? 0;
  const price = pkg.price ?? pkg.amount ?? 0;
  const pricePerCredit = credits > 0 ? Math.round(price / credits) : 0;

  return (
    <Card
      padded={false}
      className={cn(
        'flex flex-col p-8 md:p-10',
        featured
          ? 'border-2 border-gold ring-2 ring-gold/30 md:scale-[1.03]'
          : 'border-stroke dark:border-dark-stroke'
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-muted dark:text-dark-text-muted">
          {pkg.name}
        </span>
        {pkg.discount && <Badge variant="danger">{pkg.discount}</Badge>}
        {featured && !pkg.discount && <Badge variant="gold">★</Badge>}
      </div>

      <h3 className="font-heading text-2xl font-extrabold text-navy dark:text-ivory">
        {formatNumber(credits)} {t('payment.credits')}
      </h3>
      <p className="mt-1 text-xs text-muted dark:text-dark-text-muted">
        {t('payment.perCredit', { price: formatNumber(pricePerCredit) })}
      </p>

      <div className="mt-8 flex items-baseline gap-1">
        <span className="font-heading text-4xl font-black text-navy dark:text-ivory">
          {formatNumber(price)}
        </span>
        <span className="text-base font-bold text-navy dark:text-ivory">đ</span>
      </div>

      <Button
        size="lg"
        variant={featured ? 'gold' : 'primary'}
        className="mt-auto pt-2 w-full"
        onClick={() => onSelect(pkg)}
      >
        {t('payment.select')}
      </Button>
    </Card>
  );
};

export default PackageCard;
