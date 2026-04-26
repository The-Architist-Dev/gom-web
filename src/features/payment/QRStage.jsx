import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Copy, FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { copyToClipboard, formatNumber } from '../../lib/utils';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const QRStage = ({ qrData, purchasing, notify, onConfirm, onCancel, onSimulate }) => {
  const { t } = useTranslation();

  const copy = async (text) => {
    const ok = await copyToClipboard(text);
    if (ok) notify?.(t('common.copied'), 'info');
  };

  const items = [
    { label: t('payment.qr.bank'), value: qrData?.bank_name || 'ACB' },
    { label: t('payment.qr.account'), value: qrData?.account_number || '—', copy: true },
    { label: t('payment.qr.owner'), value: qrData?.account_name || '—' },
    {
      label: t('payment.qr.content'),
      value: qrData?.transfer_content || '—',
      copy: true,
      featured: true,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <Card padded={false} className="overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* QR side */}
          <div className="flex flex-col items-center justify-center bg-surface-alt p-10 dark:bg-dark-surface-alt lg:w-2/5">
            <div className="mb-6 text-center">
              <p className="text-xs font-extrabold uppercase tracking-widest text-ceramic-dark">
                {t('payment.qr.title')}
              </p>
              <h3 className="mt-2 font-heading text-base font-extrabold text-navy dark:text-ivory">
                {t('payment.qr.subtitle')}
              </h3>
            </div>

            <div className="relative rounded-3xl bg-white p-5 shadow-md">
              <img
                src={qrData?.qr_url}
                alt="VietQR"
                className="block h-64 w-64 sm:h-72 sm:w-72"
              />
              <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-3xl border-l-4 border-t-4 border-ceramic" />
              <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-3xl border-r-4 border-t-4 border-ceramic" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-3xl border-b-4 border-l-4 border-ceramic" />
              <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-3xl border-b-4 border-r-4 border-ceramic" />
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-muted dark:text-dark-text-muted">
              <Loader2 className="animate-spin" size={14} />
              {t('payment.qr.waiting')}
            </div>
          </div>

          {/* Details side */}
          <div className="flex-1 p-10">
            <div className="mb-8">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted dark:text-dark-text-muted">
                {t('payment.qr.details')}
              </p>
              <p className="mt-1 font-heading text-3xl font-black text-navy dark:text-ivory">
                {formatNumber(qrData?.amount ?? 0)}đ
              </p>
            </div>

            <div className="space-y-3">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className={
                    it.featured
                      ? 'rounded-xl border border-dashed border-ceramic bg-ceramic/10 p-4'
                      : ''
                  }
                >
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-muted dark:text-dark-text-muted">
                    {it.label}
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span
                      className={
                        'font-bold text-navy dark:text-ivory ' +
                        (it.featured ? 'text-base' : 'text-sm')
                      }
                    >
                      {it.value}
                    </span>
                    {it.copy && (
                      <button
                        type="button"
                        onClick={() => copy(it.value)}
                        className="inline-flex items-center gap-1 rounded-lg bg-surface-alt px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-navy hover:bg-stroke dark:bg-dark-surface-alt dark:text-dark-text"
                      >
                        <Copy size={10} />
                        {t('common.copy')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3">
              <Button
                variant="primary"
                size="lg"
                loading={purchasing}
                onClick={onConfirm}
                className="w-full"
              >
                {t('payment.qr.confirm')}
              </Button>
              <Button variant="ghost" size="md" onClick={onCancel} className="w-full">
                {t('payment.qr.cancel')}
              </Button>

              {isDevelopment && (
                <div className="border-t border-stroke pt-4 text-center dark:border-dark-stroke">
                  <button
                    type="button"
                    onClick={onSimulate}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-ceramic underline-offset-2 hover:underline"
                  >
                    <FlaskConical size={12} />
                    {t('payment.qr.simulate')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 rounded-2xl border border-warning/30 bg-warning/10 p-5 text-center">
        <p className="text-xs font-semibold leading-relaxed text-warning">
          ⚠️ {t('payment.qr.warning')}
        </p>
      </div>
    </div>
  );
};

export default QRStage;

