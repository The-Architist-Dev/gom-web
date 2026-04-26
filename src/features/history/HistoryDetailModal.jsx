import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Cpu, Sparkles } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';

export const HistoryDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation();
  if (!item) return null;

  const confidence = Math.round((item.confidence ?? item.certainty ?? 0) * 100) || null;
  const imgSrc = item.image_url || (item.image_path ? `/storage/${item.image_path}` : null);

  return (
    <Modal open={!!item} onClose={onClose} size="lg" title={t('history.detail.title')}>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-surface-alt dark:bg-dark-surface-alt">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.predicted_label || 'Artifact'}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-muted">
              <Sparkles size={48} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-2xl font-bold text-navy dark:text-ivory">
              {item.predicted_label || item.name || '—'}
            </h3>
            {item.era && (
              <p className="mt-1 text-sm text-muted dark:text-dark-text-muted">{item.era}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {confidence !== null && (
              <div className="rounded-xl border border-stroke p-3 dark:border-dark-stroke">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-text-muted">
                  {t('analysis.result.confidence')}
                </div>
                <div className="mt-1 font-heading text-2xl font-bold text-navy dark:text-ivory">
                  {confidence}%
                </div>
              </div>
            )}
            {item.ai_model && (
              <div className="rounded-xl border border-stroke p-3 dark:border-dark-stroke">
                <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-text-muted">
                  <Cpu size={12} /> {t('history.detail.model')}
                </div>
                <div className="mt-1 font-heading text-base font-bold text-navy dark:text-ivory">
                  {item.ai_model}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted dark:text-dark-text-muted">
            <Calendar size={14} />
            {t('history.detail.uploadedAt')}: {formatDate(item.created_at)}
          </div>

          {item.raw_answer && (
            <div className="rounded-xl border border-stroke p-4 dark:border-dark-stroke">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-text-muted">
                {t('analysis.result.details')}
              </div>
              <p className="text-sm leading-relaxed text-navy dark:text-ivory">
                {typeof item.raw_answer === 'string'
                  ? item.raw_answer
                  : JSON.stringify(item.raw_answer, null, 2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default HistoryDetailModal;
