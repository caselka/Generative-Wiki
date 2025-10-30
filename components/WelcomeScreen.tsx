/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';
import { Translation, LanguageCode } from '../i18n';
import { UNIQUE_WORDS } from '../data/predefinedWords';
import TypingAnimation from './TypingAnimation';

interface WelcomeScreenProps {
  onWordClick: (word: string) => void;
  t: Translation;
  language: LanguageCode;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onWordClick, t, language }) => {
  const welcomeTextWords = t.welcomeText.split(/(\s+)/).filter(Boolean);

  const shuffledWords = useMemo(() => {
    const wordList = UNIQUE_WORDS[language] || UNIQUE_WORDS.en;
    // Fisher-Yates shuffle algorithm
    const array = [...wordList];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [language]);

  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setWordIndex(0); // Reset index when language changes
  }, [language]);

  useEffect(() => {
    const interval = setInterval(() => {
        setWordIndex(prevIndex => (prevIndex + 1) % shuffledWords.length);
    }, 5000); // Change word every 5 seconds

    return () => clearInterval(interval);
  }, [shuffledWords.length]);

  const currentWord = shuffledWords[wordIndex];

  return (
    <main style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1 style={{ letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {t.welcomeHeadline}
      </h1>
      <p style={{ maxWidth: '50ch', margin: '0 auto 2rem auto', color: 'var(--text-color-secondary)' }}>
        {welcomeTextWords.map((word, index) => {
          if (/\S/.test(word)) {
            const cleanWord = word.replace(/[.,!?;:()"']/g, '');
            if (cleanWord) {
              return (
                <span
                  key={index}
                  onClick={() => {
                    if (window.getSelection()?.toString().trim()) return;
                    onWordClick(cleanWord);
                  }}
                  className="interactive-word"
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        if (window.getSelection()?.toString().trim()) return;
                        onWordClick(cleanWord);
                    }
                  }}
                  aria-label={`${t.learnMore} ${cleanWord}`}
                >
                  {word}
                </span>
              );
            }
          }
          return <span key={index}>{word}</span>;
        })}
      </p>

      <div className="welcome-animation-container">
        <span 
          className="welcome-animated-word interactive-word" 
          onClick={() => {
            if (window.getSelection()?.toString().trim()) return;
            onWordClick(currentWord);
          }}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (window.getSelection()?.toString().trim()) return;
                onWordClick(currentWord);
            }
          }}
        >
           <TypingAnimation text={currentWord} key={currentWord} />
        </span>
      </div>
    </main>
  );
};

export default WelcomeScreen;