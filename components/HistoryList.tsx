/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Translation } from '../i18n';

interface HistoryListProps {
  history: string[];
  currentIndex: number;
  onHistoryClick: (index: number) => void;
  t: Translation;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, currentIndex, onHistoryClick, t }) => {
  return (
    <div className="history-container">
      <h2 className="history-title">{t.historyTitle}</h2>
      <ul className="history-list">
        {history.map((topic, index) => (
          <li key={`${topic}-${index}`}>
            <button
              onClick={() => onHistoryClick(index)}
              className={`history-item ${index === currentIndex ? 'active' : ''}`}
              aria-current={index === currentIndex ? 'page' : undefined}
              disabled={index === currentIndex}
            >
              {topic}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;