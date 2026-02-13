import React from 'react';
import { Card, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { ProgressBar } from '../../../../components/ui/Progress';
import type { CountryProgress, CountryStatus } from '../../types';
import styles from './CountryLearningCard.module.css';

/* ---------- Helpers ---------- */

const STATUS_BADGE: Record<CountryStatus, { label: string; variant: 'default' | 'info' | 'success' }> = {
  not_started: { label: 'Not Started', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'info' },
  completed:   { label: 'Completed',   variant: 'success' },
};

const CTA_LABEL: Record<CountryStatus, string> = {
  not_started: 'Start',
  in_progress: 'Continue',
  completed:   'Review',
};

const progressColor = (status: CountryStatus) => {
  if (status === 'completed') return 'success' as const;
  if (status === 'in_progress') return 'primary' as const;
  return 'primary' as const;
};

/* ---------- Props ---------- */

export interface CountryLearningCardProps {
  country: CountryProgress;
  /** Called when the user clicks the CTA button */
  onAction?: (countryId: string) => void;
}

/* ---------- Component ---------- */

export const CountryLearningCard: React.FC<CountryLearningCardProps> = ({
  country,
  onAction,
}) => {
  const {
    countryId,
    countryName,
    flagEmoji,
    teaser,
    status,
    progressPct,
    lastLessonTitle,
  } = country;

  const badge = STATUS_BADGE[status];
  const ctaLabel = CTA_LABEL[status];
  const ctaVariant = status === 'not_started' ? 'primary' : 'secondary';

  return (
    <Card hoverable className={styles.card}>
      <CardContent className={styles.body}>
        {/* ---- Header row: flag + name + badge ---- */}
        <div className={styles.headerRow}>
          <div className={styles.identity}>
            {flagEmoji ? (
              <span className={styles.flag} aria-hidden="true">{flagEmoji}</span>
            ) : (
              <img
                className={styles.flagImg}
                src={`/assets/images/countries/${countryId}.png`}
                alt={`${countryName} flag`}
              />
            )}
            <h3 className={styles.name}>{countryName}</h3>
          </div>
          <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
        </div>

        {/* ---- Teaser ---- */}
        <p className={styles.teaser}>{teaser}</p>

        {/* ---- Last lesson (only when in_progress) ---- */}
        {status === 'in_progress' && lastLessonTitle && (
          <p className={styles.lastLesson}>
            <span className={styles.lastLessonLabel}>Last lesson:</span>{' '}
            {lastLessonTitle}
          </p>
        )}

        {/* ---- Progress ---- */}
        <div className={styles.progressRow}>
          <ProgressBar
            value={progressPct}
            color={progressColor(status)}
            size="sm"
          />
          <span className={styles.pct}>{progressPct}%</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant={ctaVariant}
          size="sm"
          onClick={() => onAction?.(countryId)}
        >
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};
