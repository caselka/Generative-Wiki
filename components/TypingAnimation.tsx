/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    // This logic is more robust than appending characters based on `prevState`.
    // It avoids potential race conditions with state updates by recalculating
    // the substring from the original `text` prop on each interval.
    let i = 0;
    const typingInterval = setInterval(() => {
      i++;
      if (i <= text.length) {
        setDisplayedText(text.substring(0, i));
      } else {
        clearInterval(typingInterval);
      }
    }, 80); // Typing speed in ms

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <div className="typing-animation-container">
      <span>{displayedText}</span>
      <span className="blinking-cursor">|</span>
    </div>
  );
};

export default TypingAnimation;