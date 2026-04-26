import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  AtSign,
  Tag,
  Send,
  Brain,
  Database,
  Zap,
  Globe,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Card } from '../../components/ui/Card';
import { Input, Textarea, Label } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { contactApi } from './api';
import { getErrorMessage, isValidEmail } from '../../lib/utils';
import ShinyText from '../../components/ui/ShinyText';

const ContactInfoCard = ({ icon: Icon, title, value, note, ctaText, ctaLink }) => (
  <Card hoverable className="text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ceramic/15 text-ceramic-dark">
      <Icon size={22} />
    </div>
    <h4 className="mb-1 font-heading text-base font-bold leading-card text-navy dark:text-ivory">{title}</h4>
    <p className="mb-1 text-base font-bold leading-button text-navy dark:text-ivory">{value}</p>
    <p className="mb-3 text-xs leading-paragraph text-muted dark:text-dark-text-muted">{note}</p>
    {ctaText && (
      <a
        href={ctaLink}
        className="inline-flex items-center gap-1 text-xs font-bold text-ceramic-dark hover:underline"
      >
        {ctaText}
        <ArrowRight size={12} />
      </a>
    )}
  </Card>
);

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stroke last:border-b-0 dark:border-dark-stroke">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-bold text-navy dark:text-ivory">{question}</span>
        <ChevronDown
          size={16}
          className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''} dark:text-dark-text-muted`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-paragraph-relaxed text-muted dark:text-dark-text-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContactPage = ({ notify }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, msg: null });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFeedback({ type: 'error', msg: t('contact.form.error') });
      return;
    }
    if (!isValidEmail(form.email)) {
      setFeedback({ type: 'error', msg: t('contact.form.error') });
      return;
    }

    setSending(true);
    setFeedback({ type: null, msg: null });
    try {
      await contactApi.submit(form);
      setForm({ name: '', email: '', subject: '', message: '' });
      setFeedback({ type: 'success', msg: t('contact.form.success') });
      notify?.(t('contact.form.success'), 'success');
      setTimeout(() => setFeedback({ type: null, msg: null }), 8000);
    } catch (err) {
      const msg = getErrorMessage(err, t('contact.form.fail'));
      setFeedback({ type: 'error', msg });
      notify?.(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  const systemItems = [
    { icon: Brain, text: t('contact.system.items.ai') },
    { icon: Database, text: t('contact.system.items.data') },
    { icon: Zap, text: t('contact.system.items.speed') },
    { icon: Globe, text: t('contact.system.items.global') },
  ];

  return (
    <PageContainer>
      {/* Hero */}
      <div className="mb-12 text-center">
        <span className="text-xs font-extrabold uppercase tracking-wider leading-eyebrow text-ceramic-dark dark:text-ceramic">
          {t('contact.eyebrow')}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-extrabold leading-[1.35] text-balance text-navy dark:text-ivory md:text-5xl md:leading-[1.32]">
          <ShinyText
            text={t('contact.title')}
            speed={3.5}
            delay={0}
            color="#0A1A42"
            shineColor="#C9D8E6"
            darkColor="#F7F2E8"
            darkShineColor="#DCE7F0"
            spread={90}
            direction="left"
            yoyo={false}
          />
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-paragraph text-muted dark:text-dark-text-muted md:text-base md:leading-paragraph-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Info cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <ContactInfoCard
          icon={Mail}
          title={t('contact.info.email')}
          value="dongnguyenkh123@gmail.com"
          note={t('contact.info.emailNote')}
          ctaText={t('contact.info.emailCta')}
          ctaLink="mailto:dongnguyenkh123@gmail.com"
        />
        <ContactInfoCard
          icon={Phone}
          title={t('contact.info.phone')}
          value="0949 085 842"
          note={t('contact.info.phoneNote')}
          ctaText={t('contact.info.phoneCta')}
          ctaLink="tel:0949085842"
        />
        <ContactInfoCard
          icon={MapPin}
          title={t('contact.info.address')}
          value={t('contact.info.addressValue')}
          note={t('contact.info.addressNote')}
          ctaText={t('contact.info.addressCta')}
          ctaLink="#"
        />
      </div>

      {/* Main */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <h3 className="font-heading text-xl font-bold leading-card text-navy dark:text-ivory">
            {t('contact.form.title')}
          </h3>
          <p className="mt-1 text-sm text-muted dark:text-dark-text-muted">
            {t('contact.form.subtitle')}
          </p>

          <AnimatePresence>
            {feedback.type === 'success' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 text-sm font-semibold text-success"
              >
                <CheckCircle2 size={18} />
                {feedback.msg}
              </motion.div>
            )}
            {feedback.type === 'error' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger"
              >
                <AlertTriangle size={18} />
                {feedback.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>{t('contact.form.name')}</Label>
                <Input
                  name="name"
                  placeholder={t('contact.form.namePh')}
                  value={form.name}
                  onChange={onChange}
                  leftIcon={<UserIcon size={16} />}
                  required
                />
              </div>
              <div>
                <Label>{t('contact.form.email')}</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder={t('contact.form.emailPh')}
                  value={form.email}
                  onChange={onChange}
                  leftIcon={<AtSign size={16} />}
                  required
                />
              </div>
            </div>

            <div>
              <Label>{t('contact.form.subject')}</Label>
              <Input
                name="subject"
                placeholder={t('contact.form.subjectPh')}
                value={form.subject}
                onChange={onChange}
                leftIcon={<Tag size={16} />}
              />
            </div>

            <div>
              <Label>{t('contact.form.message')}</Label>
              <Textarea
                name="message"
                placeholder={t('contact.form.messagePh')}
                value={form.message}
                onChange={onChange}
                rows={6}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={sending}
              rightIcon={!sending && <Send size={16} />}
              className="w-full"
            >
              {sending ? t('contact.form.sending') : t('contact.form.submit')}
            </Button>
          </form>
        </Card>

        {/* Side */}
        <div className="space-y-6">
          <Card>
            <h4 className="mb-4 flex items-center gap-2 font-heading text-base font-bold leading-card text-navy dark:text-ivory">
              <ShieldCheck className="text-ceramic" size={18} />
              {t('contact.system.title')}
            </h4>
            <ul className="space-y-3">
              {systemItems.map((it, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ceramic/10 text-ceramic-dark">
                    <it.icon size={14} />
                  </div>
                  <span className="text-muted dark:text-dark-text-muted">{it.text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h4 className="mb-2 font-heading text-base font-bold leading-card text-navy dark:text-ivory">
              {t('contact.faq.title')}
            </h4>
            <FAQItem question={t('contact.faq.q1')} answer={t('contact.faq.a1')} />
            <FAQItem question={t('contact.faq.q2')} answer={t('contact.faq.a2')} />
            <FAQItem question={t('contact.faq.q3')} answer={t('contact.faq.a3')} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContactPage;

