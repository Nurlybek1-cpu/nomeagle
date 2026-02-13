import React from 'react';
import styles from './Card.module.css';

/* ---------- Card ---------- */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...rest }) => (
  <div className={[styles.card, className].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

/* ---------- CardHeader ---------- */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={[styles.header, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

/* ---------- CardContent ---------- */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={[styles.content, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

/* ---------- CardFooter ---------- */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className,
  children,
  ...rest
}) => (
  <div
    className={[styles.footer, className].filter(Boolean).join(' ')}
    {...rest}
  >
    {children}
  </div>
);
