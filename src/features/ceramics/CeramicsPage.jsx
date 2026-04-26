import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/states';
import { CeramicDetailModal } from './CeramicDetailModal';
import { ceramicsApi } from './api';
import { cn, getErrorMessage } from '../../lib/utils';
import ShinyText from '../../components/ui/ShinyText';

export const CeramicsPage = ({ notify }) => {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    ceramicsApi
      .list()
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        setList(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = getErrorMessage(err);
        setError(msg);
        notify?.(msg, 'error');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [notify]);

  const countries = useMemo(() => {
    const set = new Set(list.map((it) => it.country).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [list]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return list.filter((it) => {
      if (country !== 'all' && it.country !== country) return false;
      if (!q) return true;
      return [it.name, it.origin, it.country, it.style, it.era]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [list, search, country]);

  return (
    <PageContainer>
      <PageHeader 
        title={
          <ShinyText
            text={t('ceramics.title')}
            speed={3}
            delay={0}
            color="#0A1A42"
            shineColor="#B8CAD8"
            spread={80}
            direction="left"
            yoyo={false}
          />
        }
        subtitle={t('ceramics.subtitle')} 
      />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder={t('ceramics.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold uppercase transition-colors',
                country === c
                  ? 'border-navy bg-navy text-white dark:border-ceramic dark:bg-ceramic dark:text-navy-dark'
                  : 'border-stroke bg-surface text-muted hover:border-navy hover:text-navy dark:border-dark-stroke dark:bg-dark-surface dark:text-dark-text-muted dark:hover:text-ivory'
              )}
            >
              {c === 'all' ? t('ceramics.filterAll') : c}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingState message={t('common.loading')} />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && filtered.length === 0 && (
        <EmptyState icon={Filter} title={t('ceramics.noResults')} />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((line) => (
            <Card
              key={line.id}
              padded={false}
              hoverable
              className="cursor-pointer overflow-hidden"
              onClick={() => setSelected(line)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface-alt dark:bg-dark-surface-alt">
                {line.image_url ? (
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
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <Search size={36} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  {line.is_featured && <Badge variant="gold">{t('ceramics.featured')}</Badge>}
                  {line.country && <Badge variant="navy">{line.country}</Badge>}
                </div>
                <h3 className="font-heading text-lg font-bold leading-card text-navy dark:text-ivory">
                  {line.name}
                </h3>
                {line.era && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider leading-eyebrow text-ceramic-dark">
                    {line.era}
                  </p>
                )}
                {line.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-paragraph text-muted dark:text-dark-text-muted">
                    {line.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <CeramicDetailModal item={selected} onClose={() => setSelected(null)} />
    </PageContainer>
  );
};

export default CeramicsPage;

