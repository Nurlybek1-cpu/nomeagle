import React from 'react';
import { Card, CardContent, CardFooter } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { ProgressBar } from '../../../../components/ui/Progress';
import { Icon } from '../../../../components/media/Icon';
import type { CountryProgress, CountryStatus } from '../../types';
import styles from './CountryLearningCard.module.css';

/* ==========================================================================
   CountryLearningCard
   Dashboard country card — left-column item.
   Uses SVG flag icons from /assets/icons/countries/ via the Icon system.
   ========================================================================== */

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
    teaser,
    status,
    progressPct,
    lastLessonTitle,
  } = country;

  const badge = STATUS_BADGE[status];
  const ctaLabel = CTA_LABEL[status];
  const ctaVariant = status === 'not_started' ? 'primary' : 'secondary';

  /** First letter of the country name, used as fallback */
  const initial = countryName.charAt(0).toUpperCase();

  return (
    <Card hoverable className={styles.card}>
      <CardContent className={styles.body}>
        {/* ---- Header row: flag icon + name + badge ---- */}
        <div className={styles.headerRow}>
          <div className={styles.identity}>
            <div className={styles.flagCircle}>
              <Icon
                category="countries"
                name={countryId}
                size={32}
                alt={`${countryName} flag`}
              />
              {/* Fallback initial — hidden when Icon loads;
                  visible only when Icon falls back to transparent pixel */}
              <span className={styles.flagFallback} aria-hidden="true">
                {initial}
              </span>
            </div>
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
