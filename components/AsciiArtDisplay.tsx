/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { InteractiveText } from './ContentDisplay';

interface AsciiArtDisplayProps {
  topic: string;
  synonyms: string[] | null;
  isLoading: boolean;
  onWordClick: (word: string) => void;
}

const AsciiArtDisplay: React.FC<AsciiArtDisplayProps> = ({ topic, synonyms, isLoading, onWordClick }) => {
  if (!topic) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="ascii-art-panel">
        <pre className="ascii-art-loading">
          {`[loading...]
    |
    +-- ...
    |
    +-- ...`}
        </pre>
      </div>
    );
  }

  return (
    <div className="ascii-art-panel">
      <pre>
        {'['}
        <span
          className="topic interactive-word"
          onClick={() => onWordClick(topic)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onWordClick(topic); }}
        >
          {topic}
        </span>
        {']\n'}
        {synonyms && synonyms.length > 0 ? (
          synonyms.map((synonym) => (
            <React.Fragment key={synonym}>
              {'    |\n    +-- '}
              <InteractiveText onWordClick={onWordClick}>{synonym}</InteractiveText>
              {'\n'}
            </React.Fragment>
          ))
        ) : (
          <React.Fragment>
            {'    |\n    +-- (No synonyms found)'}
          </React.Fragment>
        )}
      </pre>
    </div>
  );
};

export default AsciiArtDisplay;