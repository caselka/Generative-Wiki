/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Katex from 'react-katex';

interface ContentDisplayProps {
  content: string;
  isLoading: boolean;
  onWordClick: (word: string) => void;
}

// FIX: Explicitly added `children` to the props type. In modern React versions, `React.FC` no longer implicitly includes `children`, so it must be defined as part of the component's props. This resolves errors when the component is used with children.
export const InteractiveText: React.FC<{ onWordClick: (word: string) => void; children?: React.ReactNode }> = ({ children, onWordClick }) => {
  if (typeof children !== 'string') {
    return <>{children}</>;
  }

  const words = children.split(/(\s+)/).filter(Boolean);
  return (
    <>
      {words.map((word, wordIndex) => {
        // Check if the segment contains at least one unicode letter character.
        // This prevents pure numbers, prices, or punctuation from becoming clickable.
        if (/\p{L}/u.test(word)) {
          const cleanWord = word.replace(/[.,!?;:()"']/g, '');
          if (cleanWord) {
            return (
              <span
                key={wordIndex}
                onClick={() => {
                  if (window.getSelection()?.toString().trim()) {
                    return;
                  }
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
                aria-label={`Learn more about ${cleanWord}`}
              >
                {word}
              </span>
            );
          }
        }
        return <span key={wordIndex}>{word}</span>;
      })}
    </>
  );
};

const InteractiveContent: React.FC<{
  content: string;
  onWordClick: (word: string) => void;
}> = ({ content, onWordClick }) => {
  // Split the content by inline LaTeX expressions ($...$), keeping the expressions.
  // The regex splits the string, and the math content is at odd-indexed array elements.
  const parts = content.split(/\$([^$]+)\$/g);

  return (
    <p style={{ margin: 0 }}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          // This part is LaTeX math, render it with KaTeX
          return <Katex.InlineMath key={index} math={part} />;
        } else {
          // This part is plain text, make each word clickable
          return <InteractiveText key={index} onWordClick={onWordClick}>{part}</InteractiveText>
        }
      })}
    </p>
  );
};

const StreamingContent: React.FC<{ content: string }> = ({ content }) => (
  <p style={{ margin: 0 }}>
    {content}
    <span className="blinking-cursor">|</span>
  </p>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading, onWordClick }) => {
  if (isLoading) {
    return <StreamingContent content={content} />;
  }
  
  if (content) {
    return <InteractiveContent content={content} onWordClick={onWordClick} />;
  }

  return null;
};

export default ContentDisplay;