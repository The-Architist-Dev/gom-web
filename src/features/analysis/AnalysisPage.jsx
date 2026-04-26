import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HeroSection } from './HeroSection';
import { UploadSection } from './UploadSection';
import { ResultDashboard } from './ResultDashboard';
import { ModelShowcaseSection } from './ModelShowcaseSection';
import { analysisApi } from './api';
import { ceramicsApi } from '../ceramics/api';
import { getErrorMessage } from '../../lib/utils';
import { VIEWS } from '../../lib/constants';

export const AnalysisPage = ({ token, notify, quota, setQuota, setView, user }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [featuredLines, setFeaturedLines] = useState([]);

  useEffect(() => {
    ceramicsApi
      .list({ featured: 1 })
      .then((res) => {
        const data = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setFeaturedLines(data);
      })
      .catch(() => setFeaturedLines([]));
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const onClear = () => {
    setFile(null);
    setPreview(null);
    setError('');
  };

  const analyze = async () => {
    if ((quota?.free_used ?? 0) >= (quota?.free_limit ?? 0) && (quota?.token_balance ?? 0) <= 0) {
      notify?.(t('analysis.noQuota'), 'error');
      setView?.(VIEWS.PAYMENT);
      return;
    }
    if (!file) {
      setError(t('analysis.needFile'));
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await analysisApi.predict(formData);
      const data = res.data?.data || res.data;
      const q = res.data?.quota || data?.quota || {};
      if (q.free_used !== undefined && setQuota) {
        setQuota({
          free_used: q.free_used,
          free_limit: q.free_limit ?? quota?.free_limit ?? 5,
          token_balance: q.token_balance ?? quota?.token_balance ?? 0,
        });
      }
      notify?.(t('analysis.completeMsg'), 'success');
      setResult(data);
    } catch (err) {
      const msg = getErrorMessage(err, t('errors.server'));
      setError(msg);
      notify?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
    setError('');
  };

  const scrollToUpload = () => {
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // If we have a result, show dashboard
  if (result) {
    return (
      <PageContainer>
        <ResultDashboard result={result} preview={preview} user={user} onReset={reset} />
      </PageContainer>
    );
  }

  const featuredImage = featuredLines[0]?.image_url;

  return (
    <PageContainer>
      <HeroSection
        onUpload={scrollToUpload}
        onExplore={() => setView?.(VIEWS.LINES)}
        featuredImage={featuredImage}
      />

      {/* Trust signals */}
      <section className="grid gap-6 py-12 md:grid-cols-3">
        {[
          { icon: Sparkles, k: 'expert' },
          { icon: ShieldCheck, k: 'secure' },
          { icon: Zap, k: 'instant' },
        ].map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hoverable className="h-full text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ceramic/15 text-ceramic-dark">
                <it.icon size={22} />
              </div>
              <h3 className="font-heading text-lg font-bold leading-card text-navy dark:text-ivory">
                {t('home.trust.' + it.k)}
              </h3>
              <p className="mt-2 text-sm leading-paragraph text-muted dark:text-dark-text-muted">
                {t('home.trust.' + it.k + 'Desc')}
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      <UploadSection
        file={file}
        preview={preview}
        loading={loading}
        error={error}
        onFileChange={onFileChange}
        onAnalyze={analyze}
        onClear={onClear}
      />

      {/* 3D Model Showcase */}
      <ModelShowcaseSection setView={setView} />

      {/* Featured lines */}
      <section className="py-16">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-heading text-3xl font-extrabold leading-heading text-navy dark:text-ivory">
            {t('home.featured.title')}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight size={14} />}
            onClick={() => setView?.(VIEWS.LINES)}
          >
            {t('common.viewAll')}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredLines.length === 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} padded={false} className="overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-surface-alt dark:bg-dark-surface-alt" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-surface-alt dark:bg-dark-surface-alt" />
                </div>
              </Card>
            ))}
          {featuredLines.slice(0, 3).map((line, i) => (
            <motion.div
              key={line.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                padded={false}
                hoverable
                className="cursor-pointer overflow-hidden"
                onClick={() => setView?.(VIEWS.LINES)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-surface-alt dark:bg-dark-surface-alt">
                  {line.image_url && (
                    <img
                      src={line.image_url}
                      alt={line.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800';
                        e.currentTarget.onerror = null;
                      }}
                    />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-xs font-extrabold uppercase tracking-wider leading-eyebrow text-ceramic-dark">
                    {line.era}
                  </span>
                  <h3 className="mt-1 font-heading text-lg font-bold leading-card text-navy dark:text-ivory">
                    {line.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-paragraph text-muted dark:text-dark-text-muted">
                    {line.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
};

export default AnalysisPage;

