import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../components/ui/Modal';
import { PredictionDetailView } from '../../components/ui/PredictionDetailView';

export const HistoryDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation();
  if (!item) return null;

  return (
    <Modal open={!!item} onClose={onClose} size="xl" title={t('history.detail.title')}>
      <PredictionDetailView prediction={item} showUserInfo={false} />
    </Modal>
  );
};

export default HistoryDetailModal;

