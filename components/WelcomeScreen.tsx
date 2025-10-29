/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Translation } from '../i18n';

interface WelcomeScreenProps {
  onWordClick: (word: string) => void;
  t: Translation;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onWordClick, t }) => {
  const words = t.welcomeText.split(/(\s+)/).filter(Boolean);

  return (
    <main style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1 style={{ letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {t.welcomeHeadline}
      </h1>
      <p style={{ maxWidth: '50ch', margin: '0 auto 2rem auto', color: 'var(--text-color-secondary)' }}>
        {words.map((word, index) => {
          if (/\S/.test(word)) {
            const cleanWord = word.replace(/[.,!?;:()"']/g, '');
            if (cleanWord) {
              return (
                <button
                  key={index}
                  onClick={() => onWordClick(cleanWord)}
                  className="interactive-word"
                  aria-label={`${t.learnMore} ${cleanWord}`}
                >
                  {word}
                </button>
              );
            }
          }
          return <span key={index}>{word}</span>;
        })}
      </p>
    </main>
  );
};

export default WelcomeScreen;