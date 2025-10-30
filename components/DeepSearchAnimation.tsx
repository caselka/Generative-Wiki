/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';
import { Translation } from '../i18n';

// A self-contained typing animation for a single line of text.
const TypingLine: React.FC<{ text: string; onComplete: () => void; }> = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        i++;
        if (i <= text.length) {
          setDisplayedText(text.substring(0, i));
        } else {
          clearInterval(typingInterval);
          onComplete();
        }
      }, 80); // Typing speed in ms

      return () => clearInterval(typingInterval);
    }, [text, onComplete]);

    return (
        <div>
            <span>{displayedText}</span>
            <span className="blinking-cursor">|</span>
        </div>
    );
};

interface DeepSearchAnimationProps {
  t: Translation;
}

const DeepSearchAnimation: React.FC<DeepSearchAnimationProps> = ({ t }) => {
  const [completedPhrases, setCompletedPhrases] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shuffle phrases once on component mount for variety
  const shuffledPhrases = useMemo(() => {
    const phrases = [...t.deepSearchPhrases];
    for (let i = phrases.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [phrases[i], phrases[j]] = [phrases[j], phrases[i]];
    }
    return phrases;
  }, [t.deepSearchPhrases]);

  const handleAnimationComplete = () => {
    // Add the just-completed phrase to our list of completed lines
    const nextCompletedPhrase = shuffledPhrases[currentIndex];

    // After a brief pause, update the state to show the next line
    setTimeout(() => {
        setCompletedPhrases(prev => {
            const newCompleted = [...prev, nextCompletedPhrase];
            // To prevent the list from growing indefinitely, keep only the last few lines.
            if (newCompleted.length > 3) {
                return newCompleted.slice(newCompleted.length - 3);
            }
            return newCompleted;
        });
        setCurrentIndex(prevIndex => (prevIndex + 1) % shuffledPhrases.length);
    }, 300); // Pause between lines
  };
  
  return (
    <div className="typing-animation-container">
      <div>
        {completedPhrases.map((phrase, index) => (
          <div key={index}>{phrase}</div>
        ))}
        <TypingLine 
          text={shuffledPhrases[currentIndex]} 
          key={currentIndex} // Re-mounts TypingLine for the new phrase
          onComplete={handleAnimationComplete}
        />
      </div>
    </div>
  );
};

export default DeepSearchAnimation;
