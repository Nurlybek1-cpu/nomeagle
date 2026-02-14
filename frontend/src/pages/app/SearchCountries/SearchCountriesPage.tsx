import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Loading, EmptyState, ErrorState } from '../../../components/feedback';
import { CountryCatalogCard } from '../../../features/countries/components/CountryCatalogCard';
import styles from './SearchCountriesPage.module.css';

/* ==========================================================================
   Types
   ========================================================================== */

interface Country {
  /** ISO 3166-1 alpha-2 code (lowercase), e.g. "jp" */
  code: string;
  /** Display name, e.g. "Japan" */
  name: string;
  /** Geographic region, e.g. "Asia" */
  region: string;
  /** Short description / tagline */
  description: string;
}

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}

/* ==========================================================================
   Mock Data (9+ countries to show the grid)
   ========================================================================== */

const MOCK_COUNTRIES: Country[] = [
  {
    code: 'jp',
    name: 'Japan',
    region: 'Asia',
    description: 'Master bowing and the art of sushi etiquette.',
  },
  {
    code: 'it',
    name: 'Italy',
    region: 'Europe',
    description: 'Discover pasta traditions and expressive gestures.',
  },
  {
    code: 'br',
    name: 'Brazil',
    region: 'South America',
    description: 'Learn samba rhythms and carnival culture.',
  },
  {
    code: 'fr',
    name: 'France',
    region: 'Europe',
    description: 'Explore wine, cheese, and the art of conversation.',
  },
  {
    code: 'mx',
    name: 'Mexico',
    region: 'North America',
    description: 'Experience vibrant fiestas and rich culinary heritage.',
  },
  {
    code: 'in',
    name: 'India',
    region: 'Asia',
    description: 'Dive into diverse traditions and colorful festivals.',
  },
  {
    code: 'de',
    name: 'Germany',
    region: 'Europe',
    description: 'Appreciate precision, beer gardens, and Oktoberfest.',
  },
  {
    code: 'kr',
    name: 'South Korea',
    region: 'Asia',
    description: 'Embrace K-pop culture and traditional Hanbok attire.',
  },
  {
    code: 'au',
    name: 'Australia',
    region: 'Oceania',
    description: 'Discover outback adventures and laid-back lifestyle.',
  },
  {
    code: 'eg',
    name: 'Egypt',
    region: 'Africa',
    description: 'Uncover ancient pyramids and Nile river heritage.',
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    region: 'Europe',
    description: 'Explore royal traditions and afternoon tea customs.',
  },
  {
    code: 'th',
    name: 'Thailand',
    region: 'Asia',
    description: 'Experience temple etiquette and spicy street food.',
  },
];


/* ==========================================================================
   SearchCountriesPage
   
   ┌─────────────────────────────────────────────────────────────────┐
   │  Page Header: "Search Countries"                                │
   ├─────────────────────────────────────────────────────────────────┤
   │  [Search Input.................]   Browse by region or name     │
   ├─────────────────────────────────────────────────────────────────┤
   │  ┌─────────┐  ┌─────────┐  ┌─────────┐                         │
   │  │  Flag   │  │  Flag   │  │  Flag   │                         │
   │  │ ─────── │  │ ─────── │  │ ─────── │                         │
   │  │ Details │  │ Details │  │ Details │                         │
   │  │ ─────── │  │ ─────── │  │ ─────── │                         │
   │  │[Overview]│  │[Overview]│  │[Overview]│                         │
   │  └─────────┘  └─────────┘  └─────────┘                         │
   │  ... more rows ...                                              │
   └─────────────────────────────────────────────────────────────────┘
   
   States: loading → <Loading />  |  error → <ErrorState />  |  
           empty → <EmptyState />  |  success → grid
   ========================================================================== */

export const SearchCountriesPage: React.FC = () => {
  /* ---- State ---- */
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState<AsyncState<Country[]>>({
    status: 'success',
    data: MOCK_COUNTRIES,
  });

  /* ---- Simulate loading (for demo purposes, can remove) ---- */
  const simulateLoading = () => {
    setState({ status: 'loading' });
    setTimeout(() => {
      setState({ status: 'success', data: MOCK_COUNTRIES });
    }, 1500);
  };

  /* ---- Simulate error (for demo purposes, can remove) ---- */
  const simulateError = () => {
    setState({ status: 'error', error: 'Failed to load countries. Please try again.' });
  };

  /* ---- Filter countries by search query (client-side for now) ---- */
  const filteredCountries = useMemo(() => {
    if (!state.data) return [];
    if (!searchQuery.trim()) return state.data;

    const query = searchQuery.toLowerCase();
    return state.data.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.region.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [state.data, searchQuery]);

  /* ---- Handlers ---- */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleOverview = useCallback((code: string) => {
    // TODO: Navigate to country overview page
    console.log('Navigate to country overview:', code);
  }, []);

  const handleRetry = () => {
    simulateLoading();
  };

  /* ---- Render: Loading ---- */
  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Search Countries</h1>
        </header>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="Search a country..."
              disabled
              className={styles.searchInput}
            />
          </div>
        </div>
        <main className={styles.main}>
          <Loading rows={3} columns={3} blockHeight={280} showHeading={false} />
        </main>
      </div>
    );
  }

  /* ---- Render: Error ---- */
  if (state.status === 'error') {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Search Countries</h1>
        </header>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="Search a country..."
              disabled
              className={styles.searchInput}
            />
          </div>
        </div>
        <main className={styles.main}>
          <Card>
            <CardContent>
              <ErrorState message={state.error} onRetry={handleRetry} />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  /* ---- Render: Empty (no countries at all) ---- */
  if (!state.data || state.data.length === 0) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.pageTitle}>Search Countries</h1>
        </header>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="Search a country..."
              disabled
              className={styles.searchInput}
            />
          </div>
        </div>
        <main className={styles.main}>
          <Card>
            <CardContent>
              <EmptyState
                title="No countries available"
                description="Countries will appear here once they are added to the catalog."
              />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  /* ---- Render: Success ---- */
  return (
    <div className={styles.page}>
      {/* Page header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Search Countries</h1>
      </header>

      {/* Search bar row */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search a country..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Main content area */}
      <main className={styles.main}>
        {filteredCountries.length === 0 ? (
          /* No results for search query */
          <Card>
            <CardContent>
              <EmptyState
                title="No countries found"
                description={`No countries match "${searchQuery}". Try a different search term.`}
              />
            </CardContent>
          </Card>
        ) : (
          /* One big card containing all country cards */
          <Card className={styles.catalogCard}>
            <CardContent className={styles.catalogCardContent}>
              <div className={styles.grid}>
                {filteredCountries.map((country) => (
                  <CountryCatalogCard
                    key={country.code}
                    code={country.code}
                    name={country.name}
                    description={country.description}
                    onOverview={handleOverview}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};
