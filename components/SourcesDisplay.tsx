/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Translation } from '../i18n';

interface SourcesDisplayProps {
  sources: { uri: string; title: string }[];
  t: Translation;
}

const CollapseIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        style={{ 
            width: '0.75em', 
            height: '0.75em', 
            marginLeft: '0.5em', 
            verticalAlign: 'middle',
            transition: 'transform 0.2s ease-in-out',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
        }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);


const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources, t }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (sources.length === 0) {
    return null;
  }

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="sources-container">
      <button className="sources-title" onClick={handleToggleCollapse} aria-expanded={!isCollapsed}>
          {t.sourcesTitle}
          <CollapseIcon isCollapsed={isCollapsed} />
      </button>
      <div className={`sources-list-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <div>
          <ol className="sources-list">
            {sources.map((source, index) => (
              <li key={index} className="source-item">
                <a href={source.uri} target="_blank" rel="noopener noreferrer">
                  {source.title || new URL(source.uri).hostname}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SourcesDisplay;