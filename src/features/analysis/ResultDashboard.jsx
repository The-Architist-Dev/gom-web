import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Bot,
  Users,
  BookOpen,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ChatBox } from './ChatBox';
import { cn } from '../../lib/utils';

const SECTION_TONE = {
  agents: { icon: Bot, color: 'text-info', bg: 'bg-info/10' },
  debate: { icon: Users, color: 'text-clay', bg: 'bg-clay/10' },
  details: { icon: BookOpen, color: 'text-ceramic-dark', bg: 'bg-ceramic/10' },
};

export const ResultDashboard = ({ result, preview, user, onReset }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState({ agents: true, debate: false, details: false });
  const [showChat, setShowChat] = useState(false);

  // Normalize result shape - support both flat and nested final_report
  const r = result?.final_report || result || {};
  const label = r.predicted_label || r.name || r.label || result?.predicted_label || '—';
  const era = r.era || r.dynasty || '—';
  const origin = r.origin || r.country || '—';
  const confidence = Math.round((r.confidence ?? result?.confidence ?? 0) * 100) || 0;
  const certainty = r.certainty || r.assessment || null;
  const verdict = r.verdict || r.summary || r.reasoning || null;
  const agents = result?.agents || r.agents || [];
  const debate = result?.debate || r.debate || [];
  const details = r.details || r.detailed_analysis || null;

  const toggle = (k) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl bg-gradient-navy p-8 text-white shadow-lg md:p-12"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Badge variant="gold" className="!bg-ceramic !text-navy-dark">
            <ShieldCheck size={12} />
            {t('analysis.result.verdict')}
          </Badge>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowChat(true)} className="!text-white !hover:bg-white/10">
              <MessageCircle size={14} />
              {t('analysis.result.askAi')}
            </Button>
            <Button variant="ghost" size="sm" onClick={onReset} className="!text-white !hover:bg-white/10">
              <RotateCcw size={14} />
              {t('analysis.result.newAnalysis')}
            </Button>
          </div>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr]">
          {preview && (
            <div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-black/20">
              <img src={preview} alt="Artifact" className="aspect-square w-full object-cover" />
            </div>
          )}
          <div>
            <h2 className="font-heading text-3xl font-black md:text-5xl">{label}</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <InfoChip label={t('analysis.result.era')} value={era} />
              <InfoChip label={t('analysis.result.origin')} value={origin} />
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-white/70">
                <span>{t('analysis.result.confidence')}</span>
                <span>{confidence}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: confidence + '%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-ceramic"
                />
              </div>
              {certainty && (
                <p className="mt-3 text-xs italic text-white/70">{certainty}</p>
              )}
            </div>
          </div>
        </div>

        {verdict && (
          <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm leading-relaxed text-white/90">{verdict}</p>
          </div>
        )}
      </motion.div>

      {/* Sections */}
      <div className="mt-8 space-y-4">
        {/* Agents */}
        {Array.isArray(agents) && agents.length > 0 && (
          <CollapsibleSection
            id="agents"
            title={t('analysis.result.agents')}
            tone="agents"
            count={agents.length}
            open={expanded.agents}
            onToggle={() => toggle('agents')}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {agents.map((a, i) => (
                <AgentCard key={i} agent={a} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Debate */}
        {Array.isArray(debate) && debate.length > 0 && (
          <CollapsibleSection
            id="debate"
            title={t('analysis.result.debate')}
            tone="debate"
            count={debate.length}
            open={expanded.debate}
            onToggle={() => toggle('debate')}
          >
            <div className="space-y-3">
              {debate.map((d, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-stroke bg-surface-alt p-4 text-sm dark:border-dark-stroke dark:bg-dark-surface-alt"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="navy">{d.agent || d.role || `#${i + 1}`}</Badge>
                    {d.round && (
                      <span className="text-xs text-muted dark:text-dark-text-muted">
                        Round {d.round}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed text-navy dark:text-dark-text">
                    {d.content || d.argument || d.message || d.text || JSON.stringify(d)}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Details */}
        {details && (
          <CollapsibleSection
            id="details"
            title={t('analysis.result.details')}
            tone="details"
            open={expanded.details}
            onToggle={() => toggle('details')}
          >
            <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-sm leading-relaxed text-navy dark:text-dark-text">
              {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
            </div>
          </CollapsibleSection>
        )}
      </div>

      {/* Chat overlay */}
      {showChat && <ChatBox user={user} onClose={() => setShowChat(false)} />}
    </div>
  );
};

const InfoChip = ({ label, value }) => (
  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
    <div className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">
      {label}
    </div>
    <div className="font-heading text-base font-bold">{value}</div>
  </div>
);

const CollapsibleSection = ({ id, title, tone, count, open, onToggle, children }) => {
  const cfg = SECTION_TONE[tone] || SECTION_TONE.details;
  const Icon = cfg.icon;

  return (
    <Card padded={false}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5"
      >
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', cfg.bg)}>
            <Icon className={cfg.color} size={18} />
          </div>
          <div className="text-left">
            <h3 className="font-heading text-base font-bold text-navy dark:text-ivory">
              {title}
            </h3>
            {count != null && (
              <p className="text-xs text-muted dark:text-dark-text-muted">{count} entries</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={cn(
            'text-muted transition-transform duration-300 dark:text-dark-text-muted',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="border-t border-stroke px-6 py-5 dark:border-dark-stroke">{children}</div>
      )}
    </Card>
  );
};

const AgentCard = ({ agent }) => {
  const name = agent.name || agent.agent || 'Agent';
  const verdict = agent.verdict || agent.label || agent.prediction;
  const confidence = agent.confidence != null ? Math.round(agent.confidence * 100) : null;
  const reason = agent.reasoning || agent.explanation || agent.summary;

  return (
    <div className="rounded-2xl border border-stroke bg-surface p-4 dark:border-dark-stroke dark:bg-dark-surface">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-navy text-white">
            <Sparkles size={14} />
          </div>
          <h4 className="font-heading text-base font-bold text-navy dark:text-ivory">{name}</h4>
        </div>
        {confidence != null && <Badge variant="gold">{confidence}%</Badge>}
      </div>
      {verdict && (
        <p className="mb-2 text-sm font-bold text-navy dark:text-ivory">{verdict}</p>
      )}
      {reason && (
        <p className="text-xs leading-relaxed text-muted dark:text-dark-text-muted">{reason}</p>
      )}
    </div>
  );
};

export default ResultDashboard;

