/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode, languages } from '../i18n';

interface LanguageDropdownProps {
  language: LanguageCode;
  onLanguageChange: (newLang: LanguageCode) => void;
}

const DownArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '0.75em', height: '0.75em', marginLeft: '0.5em', verticalAlign: 'middle' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ language, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleSelect = (langCode: LanguageCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-dropdown-container" ref={dropdownRef}>
      <button onClick={handleToggle} className="language-dropdown-trigger" aria-haspopup="listbox" aria-expanded={isOpen} aria-label="Select language">
        <span>{languages[language]}</span>
        <DownArrowIcon />
      </button>
      {isOpen && (
        <ul className="language-dropdown-menu" role="listbox">
          {Object.entries(languages).map(([code, name]) => (
            <li key={code} role="option" aria-selected={code === language}>
              <button
                onClick={() => handleSelect(code as LanguageCode)}
                className={`language-dropdown-item ${code === language ? 'active' : ''}`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
