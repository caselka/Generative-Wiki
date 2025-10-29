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
  t: Translation;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onRandom, 
  isLoading,
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