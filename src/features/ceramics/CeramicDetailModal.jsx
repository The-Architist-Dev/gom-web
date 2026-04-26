import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

export const CeramicDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation();
  if (!item) return null;

  return (
    <Modal open={!!item} onClose={onClose} size="xl" title={item.name}>
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-surface-alt dark:bg-dark-surface-alt">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-muted">No image</div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {item.is_featured && <Badge variant="gold">{t('ceramics.featured')}</Badge>}
            {item.country && <Badge variant="navy">{item.country}</Badge>}
            {item.era && <Badge variant="info">{item.era}</Badge>}
          </div>

          <h2 className="font-heading text-3xl font-bold text-navy dark:text-ivory">{item.name}</h2>

          <div className="grid gap-3 text-sm">
            {item.origin && (
              <DetailRow label={t('ceramics.detail.origin')} value={item.origin} />
            )}
            {item.country && (
              <DetailRow label={t('ceramics.detail.country')} value={item.country} />
            )}
            {item.era && <DetailRow label={t('ceramics.detail.era')} value={item.era} />}
            {item.style && <DetailRow label={t('ceramics.detail.style')} value={item.style} />}
          </div>

          {item.description && (
            <Section title={t('ceramics.detail.history')}>
              <p>{item.description}</p>
            </Section>
          )}
          {item.characteristics && (
            <Section title={t('ceramics.detail.characteristics')}>
              <p>{item.characteristics}</p>
            </Section>
          )}
          {item.techniques && (
            <Section title={t('ceramics.detail.techniques')}>
              <p>{item.techniques}</p>
            </Section>
          )}
        </div>
      </div>
    </Modal>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-stroke px-4 py-2.5 dark:border-dark-stroke">
    <span className="text-xs font-bold uppercase tracking-wider text-muted dark:text-dark-text-muted">
      {label}
    </span>
    <span className="text-right text-sm font-semibold text-navy dark:text-ivory">{value}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h4 className="mb-2 font-heading text-base font-bold text-navy dark:text-ivory">{title}</h4>
    <div className="text-sm leading-relaxed text-muted dark:text-dark-text-muted">{children}</div>
  </div>
);

export default CeramicDetailModal;
