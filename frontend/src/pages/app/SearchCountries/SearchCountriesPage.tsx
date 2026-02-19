import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../components/ui/Card';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Loading, EmptyState, ErrorState } from '../../../components/feedback';
import { CountryCatalogCard } from '../../../features/countries/components/CountryCatalogCard';
import { RegionFilters } from '../../../features/countries/components/RegionFilters';
import { COUNTRIES_CATALOG, addLearningCountry } from '../../../features/countries/data';
import type { CatalogCountry } from '../../../features/countries/data';
import styles from './SearchCountriesPage.module.css';

/* ==========================================================================
   Types
   ========================================================================== */

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  status: AsyncStatus;
  data?: T;
  error?: string;
}


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
   │  │ [Learn]  │  │ [Learn]  │  │ [Learn]  │                         │
   │  └─────────┘  └─────────┘  └─────────┘                         │
   │  ... more rows ...                                              │
   └─────────────────────────────────────────────────────────────────┘
   
   States: loading → <Loading />  |  error → <ErrorState />  |  
           empty → <EmptyState />  |  success → grid
   ========================================================================== */

export const SearchCountriesPage: React.FC = () => {
  const navigate = useNavigate();
  /* ---- State ---- */
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedEthnicGroups, setSelectedEthnicGroups] = useState<string[]>([]);
  const [state, setState] = useState<AsyncState<CatalogCountry[]>>({
    status: 'success',
    data: COUNTRIES_CATALOG,
  });

  /* ---- Simulate loading (for demo purposes, can remove) ---- */
  const simulateLoading = () => {
    setState({ status: 'loading' });
    setTimeout(() => {
      setState({ status: 'success', data: COUNTRIES_CATALOG });
    }, 1500);
  };

  /* ---- Simulate error (for demo purposes, can remove) ---- */
  const simulateError = () => {
    setState({ status: 'error', error: 'Failed to load countries. Please try again.' });
  };

  /* ---- Filter: Search (name only) + Regions (+ ethnic groups). Fast, single pass. ---- */
  const filteredCountries = useMemo(() => {
    const data = state.data;
    if (!data || data.length === 0) return [];

    const searchTerm = searchQuery.trim().toLowerCase();
    const hasSearch = searchTerm.length > 0;
    const hasRegionFilter = selectedRegions.length > 0;
    const regionSet = hasRegionFilter ? new Set(selectedRegions) : null;
    const hasEthnicFilter = selectedEthnicGroups.length > 0;
    const ethnicSet = hasEthnicFilter
      ? new Set(selectedEthnicGroups)
      : null;

    return data.filter((country) => {
      if (hasRegionFilter && regionSet && !regionSet.has(country.region))
        return false;
      if (
        hasEthnicFilter &&
        ethnicSet &&
        !(country.ethnicGroups?.some((g) => ethnicSet.has(g)) ?? false)
      )
        return false;
      if (hasSearch && !country.name.toLowerCase().includes(searchTerm))
        return false;
      return true;
    });
  }, [state.data, searchQuery, selectedRegions, selectedEthnicGroups]);

  /* ---- Handlers ---- */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleRegionChange = useCallback((next: string[]) => {
    setSelectedRegions(next);
  }, []);

  const handleEthnicGroupChange = useCallback((next: string[]) => {
    setSelectedEthnicGroups(next);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedRegions([]);
    setSelectedEthnicGroups([]);
  }, []);

  const handleLearn = useCallback(
    (code: string) => {
      addLearningCountry(code);
      navigate(`/app/countries/${code}/learn`);
    },
    [navigate]
  );

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

      {/* Content: filters (left/top) + catalog */}
      <div className={styles.contentLayout}>
        <aside className={styles.filtersPanel} aria-label="Filter by region">
          <RegionFilters
            selected={selectedRegions}
            onChange={handleRegionChange}
            selectedEthnicGroups={selectedEthnicGroups}
            onEthnicGroupChange={handleEthnicGroupChange}
          />
        </aside>
        <main className={styles.main}>
          {filteredCountries.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState
                  title="No countries found"
                  description="Try another search or filter."
                  actionLabel="Clear filters"
                  onAction={handleClearFilters}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className={styles.catalogCard}>
              <CardContent className={styles.catalogCardContent}>
                <div className={styles.grid}>
                  {filteredCountries.map((country) => (
                    <CountryCatalogCard
                      key={country.code}
                      code={country.code}
                      name={country.name}
                      description={country.description}
                      onLearn={handleLearn}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};
