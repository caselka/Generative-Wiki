/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Translation } from '../i18n';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onRandom: () => void;
  isLoading: boolean;
  onBack: () => void;
  onForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  t: Translation;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onRandom, 
  isLoading,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
  t
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="search-container">
      <button onClick={onBack} className="nav-button" disabled={!canGoBack || isLoading} aria-label={t.goBack}>
        ←
      </button>
      <button onClick={onForward} className="nav-button" disabled={!canGoForward || isLoading} aria-label={t.goForward}>
        →
      </button>
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="search-input"
          aria-label={t.searchAriaLabel}
          disabled={isLoading}
        />
      </form>
      <button onClick={onRandom} className="random-button" disabled={isLoading}>
        {t.randomButton}
      </button>
    </div>
  );
};

export default SearchBar;