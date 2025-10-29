/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface WelcomeScreenProps {
  onWordClick: (word: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onWordClick }) => {
  const welcomeText = "An encyclopedia where every word is a link. Start by searching for a topic or choosing a random one to begin your journey.";
  const words = welcomeText.split(/(\s+)/).filter(Boolean);

  return (
    <main style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1 style={{ letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        GENERATIVE WIKI
      </h1>
      <p style={{ maxWidth: '50ch', margin: '0 auto 2rem auto', color: '#555' }}>
        {words.map((word, index) => {
          if (/\S/.test(word)) {
            const cleanWord = word.replace(/[.,!?;:()"']/g, '');
            if (cleanWord) {
              return (
                <button
                  key={index}
                  onClick={() => onWordClick(cleanWord)}
                  className="interactive-word"
                  aria-label={`Learn more about ${cleanWord}`}
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