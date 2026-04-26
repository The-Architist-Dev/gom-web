import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, ArrowRight, Building2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { cn, formatNumber } from '../../lib/utils';

export const MethodList = ({ pkg, purchasing, onBack, onPick }) => {
  const { t } = useTranslation();

  const methods = [
    {
      id: 'vietqr',
      name: t('payment.method.vietqr'),
      sub: t('payment.method.vietqrSub'),
      iconType: 'icon',
    },
    {
      id: 'momo',
      name: t('payment.method.momo'),
      sub: t('payment.method.momoSub'),
      iconType: 'image',
      iconUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png',
    },
    {
      id: 'zalopay',
      name: t('payment.method.zalopay'),
      sub: t('payment.method.zalopaySub'),
      iconType: 'image',
      iconUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png',
    },
  ];

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt text-navy hover:bg-stroke dark:bg-dark-surface-alt dark:text-dark-text dark:hover:bg-dark-stroke"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h3 className="font-heading text-xl font-extrabold text-navy dark:text-ivory">
            {t('payment.method.title')}
          </h3>
          <p className="text-xs text-muted dark:text-dark-text-muted">
            {pkg?.name} — {formatNumber(pkg?.credits ?? pkg?.credit_amount)} {t('payment.credits')}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {methods.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={purchasing}
            onClick={() => onPick(m.id)}
            className={cn(
              'flex items-center justify-between rounded-2xl border border-stroke bg-surface p-5 text-left transition-all hover:border-ceramic hover:shadow-md dark:border-dark-stroke dark:bg-dark-surface',
              purchasing && 'pointer-events-none opacity-60'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt shadow-sm dark:bg-dark-surface-alt">
                {m.iconType === 'image' ? (
                  <img src={m.iconUrl} alt={m.name} className="h-8 w-8 rounded-md object-contain" />
                ) : (
                  <Building2 className="text-navy dark:text-ceramic" size={22} />
                )}
              </div>
              <div>
                <div className="text-sm font-extrabold text-navy dark:text-ivory">{m.name}</div>
                <div className="text-xs text-muted dark:text-dark-text-muted">{m.sub}</div>
              </div>
            </div>
            {purchasing ? (
              <Loader2 className="animate-spin text-navy dark:text-ceramic" size={18} />
            ) : (
              <ArrowRight className="text-muted dark:text-dark-text-muted" size={18} />
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 border-t border-stroke pt-6 text-center dark:border-dark-stroke">
        <p className="text-xs text-muted dark:text-dark-text-muted">{t('payment.total')}</p>
        <p className="font-heading text-3xl font-black text-navy dark:text-ivory">
          {formatNumber(pkg?.price ?? pkg?.amount ?? 0)}đ
        </p>
      </div>
    </Card>
  );
};

export default MethodList;

