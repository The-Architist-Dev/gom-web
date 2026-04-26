import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Landmark, ShieldCheck, Database, Users, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { CountUpNumber } from '../../components/motion';
import { analysisApi } from '../analysis/api';

export const AboutPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total_analyzed: null, accuracy: null });

  useEffect(() => {
    analysisApi
      .getStats()
      .then((res) => {
        setStats({
          total_analyzed: res.data?.total_analyzed ?? 0,
          accuracy: res.data?.accuracy ?? 0,
        });
      })
      .catch(() => setStats({ total_analyzed: 0, accuracy: 0 }));
  }, []);

  const features = [
    {
      icon: ShieldCheck,
      title: t('about.features.accuracy.title'),
      desc: t('about.features.accuracy.desc'),
    },
    {
      icon: Database,
      title: t('about.features.data.title'),
      desc: t('about.features.data.desc'),
    },
    {
      icon: Users,
      title: t('about.features.community.title'),
      desc: t('about.features.community.desc'),
    },
  ];

  return (
    <PageContainer>
      {/* Hero */}
      <div className="mb-20 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.25em] text-gold">
          <Landmark size={14} />
          {t('about.eyebrow')}
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-navy dark:text-ivory md:text-5xl">
          {t('about.title')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted dark:text-dark-text-muted">
          {t('about.subtitle')}
        </p>
      </div>

      {/* Features */}
      <div className="mb-20 grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hoverable className="h-full text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-stroke bg-surface-alt dark:border-dark-stroke dark:bg-dark-surface-alt">
                <f.icon className="h-10 w-10 text-navy dark:text-gold" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-navy dark:text-ivory">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted dark:text-dark-text-muted">
                {f.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mission */}
      <div className="overflow-hidden rounded-3xl bg-gradient-navy p-10 text-white shadow-lg md:p-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h3 className="font-heading text-3xl font-black leading-tight md:text-4xl">
              {t('about.mission.title')}{' '}
              <span className="text-gold">{t('about.mission.highlight')}</span>
            </h3>
            <p className="mt-6 text-base leading-relaxed text-white/85">
              {t('about.mission.p1')}
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              {t('about.mission.p2')}
            </p>
          </div>
          <div className="rounded-3xl bg-white/95 p-10 text-navy shadow-2xl">
            <div>
              <div className="font-heading text-5xl font-black text-gold">
                {stats.total_analyzed !== null
                  ? <CountUpNumber end={stats.total_analyzed} separator="," />
                  : '...'}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted">
                <ImageIcon size={14} />
                {t('about.mission.stats1')}
              </div>
            </div>
            <div className="my-8 h-px bg-stroke" />
            <div>
              <div className="font-heading text-5xl font-black text-gold">
                {stats.accuracy !== null
                  ? <CountUpNumber end={stats.accuracy} decimals={1} suffix="%" />
                  : '...'}
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-muted">
                <CheckCircle2 size={14} />
                {t('about.mission.stats2')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AboutPage;
