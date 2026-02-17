import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui';
import { SegmentedControl } from '../../../../components/ui';
import type { PracticeTimeBreakdown, TimeRangeShort } from '../../types';
import styles from './PracticeTimeCard.module.css';

/* --------------------------------------------------------------------------
   Format seconds as HH:MM:SS
   -------------------------------------------------------------------------- */

function formatHms(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/* --------------------------------------------------------------------------
   Donut chart (SVG, 3 segments: typing, learning, not passed)
   -------------------------------------------------------------------------- */

const DONUT_SIZE = 160;
const DONUT_STROKE = 28;
const DONUT_R = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_OUTER_R = DONUT_R + DONUT_STROKE / 2;
const DONUT_INNER_R = DONUT_R - DONUT_STROKE / 2;
const DONUT_CX = DONUT_SIZE / 2;
const DONUT_CY = DONUT_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_R;

/* Legend: label, seconds key, color (stroke + text), segment index for line angle */
const LEGEND_ITEMS = [
  { key: 'typing', label: 'Practice', color: '#0d9488', className: styles.segmentTyping },
  { key: 'learning', label: 'Learning', color: '#38bdf8', className: styles.segmentLearning },
  { key: 'notPassed', label: 'Not Passed', color: '#f472b6', className: styles.segmentNotPassed },
] as const;

/* Wrapper size for donut + leader lines and labels */
const CHART_WIDTH = 280;
const CHART_HEIGHT = 180;
const DONUT_OX = 60;
const DONUT_OY = 10;
const CENTER_X = DONUT_OX + DONUT_CX;
const CENTER_Y = DONUT_OY + DONUT_CY;

function DonutChart({ data }: { data: PracticeTimeBreakdown }) {
  const { typingSeconds, learningSeconds, notPassedSeconds, totalSeconds } = data;
  const total = totalSeconds || 1;

  const segments = useMemo(() => {
    const lenT = (typingSeconds / total) * CIRCUMFERENCE;
    const lenL = (learningSeconds / total) * CIRCUMFERENCE;
    const lenN = (notPassedSeconds / total) * CIRCUMFERENCE;
    return [
      { len: lenT, offset: 0, className: styles.segmentTyping },
      { len: lenL, offset: -lenT, className: styles.segmentLearning },
      { len: lenN, offset: -(lenT + lenL), className: styles.segmentNotPassed },
    ];
  }, [typingSeconds, learningSeconds, notPassedSeconds, totalSeconds]);

  const outerR = DONUT_OUTER_R;
  const labelOffset = 48;

  /* Segment outer points (midpoint on ring) and label position = segment + outward offset */
  const segmentLabels = useMemo(() => {
    const lenT = (typingSeconds / total) * CIRCUMFERENCE;
    const lenL = (learningSeconds / total) * CIRCUMFERENCE;
    const lenN = (notPassedSeconds / total) * CIRCUMFERENCE;
    const r = DONUT_R;
    const toAngle = (s: number) => -Math.PI / 2 - s / r;
    const toOuterPoint = (angle: number) => ({
      x: CENTER_X + outerR * Math.cos(angle),
      y: CENTER_Y + outerR * Math.sin(angle),
    });
    const midpoints = [
      toOuterPoint(toAngle(lenT / 2)),
      toOuterPoint(toAngle(lenT + lenL / 2)),
      toOuterPoint(toAngle(lenT + lenL + lenN / 2)),
    ];
    return midpoints.map((pt) => {
      const ux = (pt.x - CENTER_X) / outerR;
      const uy = (pt.y - CENTER_Y) / outerR;
      return {
        ring: pt,
        label: {
          x: pt.x + labelOffset * ux,
          y: pt.y + labelOffset * uy,
        },
      };
    });
  }, [typingSeconds, learningSeconds, notPassedSeconds, total]);

  const secondsByKey = useMemo(
    () => ({
      typing: typingSeconds,
      learning: learningSeconds,
      notPassed: notPassedSeconds,
    }),
    [typingSeconds, learningSeconds, notPassedSeconds]
  );

  return (
    <div className={styles.donutChartWrap}>
      <svg
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.donutChartSvg}
        aria-hidden
      >
        <g transform={`translate(${DONUT_OX}, ${DONUT_OY}) rotate(-90 ${DONUT_CX} ${DONUT_CY})`}>
          {segments.map((seg, i) => (
            <circle
              key={i}
              className={seg.className}
              cx={DONUT_CX}
              cy={DONUT_CY}
              r={DONUT_R}
              fill="none"
              strokeWidth={DONUT_STROKE}
              strokeDasharray={`${seg.len} ${CIRCUMFERENCE}`}
              strokeDashoffset={seg.offset}
            />
          ))}
        </g>
        {segmentLabels.map(({ ring, label }, i) => {
          const color = LEGEND_ITEMS[i].color;
          const points = `${label.x},${label.y} ${ring.x},${ring.y}`;
          return (
            <polyline
              key={i}
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              className={styles.leaderLine}
            />
          );
        })}
      </svg>
      <div
        className={styles.donutCenter}
        style={{
          left: DONUT_OX,
          top: DONUT_OY,
          width: DONUT_SIZE,
          height: DONUT_SIZE,
        }}
      >
        <span className={styles.donutTime}>{formatHms(totalSeconds)}</span>
      </div>
      {segmentLabels.map(({ label }, i) => {
        const item = LEGEND_ITEMS[i];
        const seconds = secondsByKey[item.key];
        const isRight = label.x > CENTER_X;
        const dotRadius = 4;
        return (
          <div
            key={item.key}
            className={isRight ? styles.legendItemRight : styles.legendItemLeft}
            style={
              isRight
                ? { left: label.x - dotRadius, top: label.y - dotRadius }
                : { right: CHART_WIDTH - label.x - dotRadius, top: label.y - dotRadius }
            }
          >
            <span
              className={styles.legendDot}
              style={{ background: item.color }}
              aria-hidden
            />
            <div className={styles.legendText}>
              <span className={styles.legendLabel}>{item.label}</span>
              <span className={styles.legendTime} style={{ color: item.color }}>
                {formatHms(seconds)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------------------------------------------------
   PracticeTimeCard props
   -------------------------------------------------------------------------- */

export interface PracticeTimeCardProps {
  practiceTime: Record<TimeRangeShort, PracticeTimeBreakdown>;
  className?: string;
}

const TIME_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'overall', label: 'Overall' },
] as const;

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export const PracticeTimeCard: React.FC<PracticeTimeCardProps> = ({
  practiceTime,
  className,
}) => {
  const [range, setRange] = useState<TimeRangeShort>('overall');
  const data = practiceTime[range];

  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardHeader className={styles.header}>
        <h3 className={styles.title}>Practice Time</h3>
        <div className={styles.infoWrap}>
          <button
            type="button"
            className={styles.infoBtn}
            aria-label="Information about practice time"
            aria-describedby="practice-time-tooltip"
          >
            <span className={styles.infoIcon}>i</span>
          </button>
          <div
            id="practice-time-tooltip"
            className={styles.tooltip}
            role="tooltip"
          >
            <p className={styles.tooltipLine}>
              <strong>Practice:</strong> Time spent on practice activities and lessons that were passed.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Learning:</strong> Time spent exploring cultures, traditions, and key concepts around the world.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Incomplete:</strong> Time spent on activities and lessons not yet completed.
            </p>
            <p className={styles.tooltipLine}>
              <strong>Not Passed:</strong> Time spent on activities and lessons that were not passed.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.donutSection}>
          <DonutChart data={data} />
        </div>
        <SegmentedControl
          value={range}
          options={TIME_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          onChange={(v) => setRange(v as TimeRangeShort)}
          size="sm"
          aria-label="Time range"
          className={styles.toggle}
        />
      </CardContent>
    </Card>
  );
};
