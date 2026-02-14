import React, { useCallback, useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import styles from './CountryCatalogCard.module.css';

/* ==========================================================================
   CountryCatalogCard
   Catalog-style country card for the Search Countries page.
   No settings menu — flag, name, description, Overview button only.
   
   Layout:
   ┌─────────────────────────────────┐
   │                                 │
   │     FLAG (full-width background)│
   │     aspect-ratio 3:2            │
   │                                 │
   ├─────────────────────────────────┤
   │  Country Name (bold)             │
   │  Short description (muted)      │
   ├─────────────────────────────────┤
   │              [Overview] button  │
   └─────────────────────────────────┘
   ========================================================================== */

/* ==========================================================================
   Icon Path Map
   Put real filenames from /public/assets/icons/actions/ here
   ========================================================================== */
const ICON_PATHS = {
  /** Overview icon shown inside the Overview button */
  overview: '/assets/icons/actions/overview.svg',
} as const;

/* ---------- Helpers ---------- */

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

/** 1x1 transparent placeholder for broken flag images */
const FLAG_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/* ==========================================================================
   Props
   ========================================================================== */

export interface CountryCatalogCardProps {
  /** ISO 3166-1 alpha-2 code (lowercase), e.g. "jp" */
  code: string;
  /** Display name, e.g. "Japan" */
  name: string;
  /** Geographic region (optional, for accessibility) */
  region?: string;
  /** Short description / tagline */
  description: string;
  /** Called when the Overview button is clicked */
  onOverview: (code: string) => void;
  /** Optional extra className */
  className?: string;
}

/* ==========================================================================
   Component
   ========================================================================== */

export const CountryCatalogCard: React.FC<CountryCatalogCardProps> = ({
  code,
  name,
  description,
  onOverview,
  className,
}) => {
  /* ---- State for flag image fallback ---- */
  const [flagSrc, setFlagSrc] = useState(`/assets/icons/countries/${code}.svg`);
  const [flagError, setFlagError] = useState(false);

  /** Handle flag image load error — show fallback */
  const handleFlagError = useCallback(() => {
    setFlagSrc(FLAG_PLACEHOLDER);
    setFlagError(true);
  }, []);

  /** First letter of country name (fallback when flag fails) */
  const initial = name.charAt(0).toUpperCase();

  /** Handle Overview button click */
  const handleOverviewClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onOverview(code);
    },
    [code, onOverview]
  );

  return (
    <Card
      hoverable
      className={cx(styles.card, className)}
      role="article"
      aria-label={`${name} country card`}
    >
      {/* Flag area — full-width background, 3:2 aspect ratio */}
      <div className={styles.flagArea}>
        <img
          src={flagSrc}
          alt={`${name} flag`}
          className={styles.flagImage}
          onError={handleFlagError}
          draggable={false}
        />
        {flagError && (
          <span className={styles.flagFallback} aria-hidden="true">
            {initial}
          </span>
        )}
      </div>

      {/* Details area — name + description only */}
      <div className={styles.detailsArea}>
        <h3 className={styles.countryName}>{name}</h3>
        <p className={styles.countryDescription}>{description}</p>
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Action area — Overview button at end */}
      <div className={styles.actionArea}>
        <Button
          variant="secondary"
          size="sm"
          className={styles.overviewButton}
          onClick={handleOverviewClick}
        >
          <img
            src={ICON_PATHS.overview}
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
            className={styles.buttonIcon}
          />
          Overview
        </Button>
      </div>
    </Card>
  );
};
