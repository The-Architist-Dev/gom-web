import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sparkles, Upload, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HeroSection = ({ onUpload, onExplore, featuredImage }) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-navy/10 blur-3xl" />
      </div>

      <div className="grid gap-12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-gold-dark leading-eyebrow">
            <Sparkles size={12} />
            AI Multi-Agent Debate
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.35] text-balance text-navy dark:text-ivory md:text-5xl md:leading-[1.32] lg:text-6xl lg:leading-[1.3]">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-paragraph text-muted dark:text-dark-text-muted md:text-lg md:leading-paragraph-relaxed">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Upload size={18} />}
              onClick={onUpload}
            >
              {t('home.ctaUpload')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
              onClick={onExplore}
            >
              {t('home.ctaExplore')}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 -z-10 rounded-[40px] bg-gradient-navy opacity-10 blur-2xl" />
          <div className="overflow-hidden rounded-[40px] border-4 border-stroke bg-surface shadow-xl dark:border-dark-stroke dark:bg-dark-surface">
            <img
              src={
                featuredImage ||
                'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=900'
              }
              alt="Heritage ceramic"
              className="h-[420px] w-full object-cover md:h-[500px]"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=900';
                e.currentTarget.onerror = null;
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
