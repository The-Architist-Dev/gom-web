import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Stepper } from '../../components/ui/Stepper';
import { LoadingState, ErrorState } from '../../components/ui/states';
import { Button } from '../../components/ui/Button';
import { PackageCard } from './PackageCard';
import { MethodList } from './MethodList';
import { QRStage } from './QRStage';
import { paymentApi } from './api';
import { getErrorMessage } from '../../lib/utils';
import { VIEWS } from '../../lib/constants';

// Fallback packages when API fails
const FALLBACK_PACKAGES = [
  { id: 1, name: 'Cơ Bản', credits: 10, price: 150000, discount: null },
  { id: 2, name: 'Phổ Biến', credits: 50, price: 600000, discount: 'Tiết kiệm 20%', featured: true },
  { id: 3, name: 'Chuyên Gia', credits: 200, price: 2000000, discount: '-30% off' },
];

export const PaymentPage = ({ fetchUser, notify, setView }) => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [pkgError, setPkgError] = useState(null);

  const [stage, setStage] = useState(0); // 0: select, 1: method, 2: pay
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successCredits, setSuccessCredits] = useState(0);

  // Load packages from API
  useEffect(() => {
    let cancelled = false;
    setLoadingPkg(true);
    setPkgError(null);
    paymentApi
      .packages()
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setPackages(data.length > 0 ? data : FALLBACK_PACKAGES);
      })
      .catch(() => {
        if (cancelled) return;
        // Soft fallback so user can still pick a package
        setPackages(FALLBACK_PACKAGES);
        setPkgError(null);
      })
      .finally(() => !cancelled && setLoadingPkg(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const selectPackage = (pkg) => {
    setSelectedPkg(pkg);
    setStage(1);
  };

  const reset = () => {
    setStage(0);
    setSelectedPkg(null);
    setQrData(null);
    setPaymentSuccess(false);
  };

  const buyPackage = async () => {
    if (!selectedPkg) return;
    setPurchasing(true);
    try {
      const res = await paymentApi.create(selectedPkg.id);
      const serverData = res.data?.data || res.data;
      const amount = serverData?.amount || selectedPkg.price;
      const content = serverData?.transfer_content || `GOM NAP ${selectedPkg.id}`;

      // Build robust payment data with bank fallback (server SHOULD return bank_info)
      const bankInfo = serverData?.bank_info || {};
      const bankName = bankInfo.bank_name || bankInfo.bank || serverData?.bank_name || 'ACB';
      const account = bankInfo.account_number || serverData?.account_number || '';
      const owner = bankInfo.account_name || serverData?.account_name || '';

      const qrUrl =
        serverData?.qr_url ||
        `https://qr.sepay.vn/img?bank=${encodeURIComponent(
          bankName
        )}&acc=${encodeURIComponent(account)}&template=compact&amount=${amount}&des=${encodeURIComponent(content)}`;

      setQrData({
        ...serverData,
        amount,
        transfer_content: content,
        bank_name: bankName,
        account_number: account,
        account_name: owner,
        qr_url: qrUrl,
      });
      setStage(2);
      notify?.(t('payment.scanInvite'), 'success');
    } catch (err) {
      notify?.(t('payment.failed'), 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const checkStatus = async () => {
    if (!qrData) return;
    setPurchasing(true);
    try {
      const id = qrData.id || qrData.payment_id;
      const res = await paymentApi.check(id);
      const data = res.data?.data || res.data;
      if (data?.status === 'completed') {
        const credits = data.credit_amount || selectedPkg?.credits || 0;
        setSuccessCredits(credits);
        setPaymentSuccess(true);
        fetchUser?.();
      } else {
        notify?.(t('payment.checking'), 'info');
      }
    } catch (err) {
      notify?.(getErrorMessage(err), 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const simulateSuccess = async () => {
    if (!qrData) return;
    try {
      const id = qrData.payment_id || qrData.id;
      const res = await paymentApi.testComplete(id);
      const data = res.data?.data || res.data;
      if (data?.status === 'completed') {
        setSuccessCredits(data.credit_amount || selectedPkg?.credits || 0);
        setPaymentSuccess(true);
        fetchUser?.();
      }
    } catch (err) {
      notify?.(getErrorMessage(err, 'Lỗi khi giả lập thanh toán'), 'error');
    }
  };

  const finish = () => {
    setPaymentSuccess(false);
    reset();
    setView?.(VIEWS.TRANSACTION_HISTORY);
  };

  const currentStage = Math.max(stage, qrData ? 2 : selectedPkg ? 1 : 0);
  const steps = [
    { id: 0, label: t('payment.steps.package') },
    { id: 1, label: t('payment.steps.method') },
    { id: 2, label: t('payment.steps.pay') },
  ];

  return (
    <PageContainer>
      <PageHeader title={t('payment.title')} subtitle={t('payment.subtitle')} centered />

      <div className="mb-12">
        <Stepper steps={steps} current={currentStage} />
      </div>

      {currentStage === 0 && (
        <>
          {loadingPkg && <LoadingState message={t('common.loading')} />}
          {pkgError && <ErrorState message={pkgError} />}
          {!loadingPkg && !pkgError && (
            <div className="grid gap-6 md:grid-cols-3">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onSelect={selectPackage} />
              ))}
            </div>
          )}
        </>
      )}

      {currentStage === 1 && selectedPkg && (
        <MethodList pkg={selectedPkg} purchasing={purchasing} onBack={reset} onPick={() => buyPackage()} />
      )}

      {currentStage === 2 && qrData && (
        <QRStage
          qrData={qrData}
          purchasing={purchasing}
          notify={notify}
          onConfirm={checkStatus}
          onCancel={reset}
          onSimulate={simulateSuccess}
        />
      )}

      {/* Success modal */}
      {paymentSuccess &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-full max-w-md rounded-3xl bg-surface p-10 text-center shadow-lg dark:bg-dark-surface"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success">
                  <Check size={36} strokeWidth={3} />
                </div>
                <h3 className="font-heading text-2xl font-bold leading-heading text-navy dark:text-ivory">
                  {t('payment.success.title')}
                </h3>
                <p className="mt-3 text-sm leading-paragraph text-muted dark:text-dark-text-muted">
                  {t('payment.success.msg', { credits: successCredits })}
                </p>
                <Button variant="primary" size="lg" onClick={finish} className="mt-6 w-full">
                  {t('common.confirm')}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </PageContainer>
  );
};

export default PaymentPage;
