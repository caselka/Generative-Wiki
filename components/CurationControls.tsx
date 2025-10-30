/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Translation } from '../i18n';

interface CurationControlsProps {
  rating: 'up' | 'down' | null;
  onRate: (newRating: 'up' | 'down') => void;
  onSubmitFeedback: (reason: string) => Promise<void>;
  topic: string;
  content: string;
  expandedContent: string;
  history: string[];
  historyIndex: number;
  t: Translation;
}

const ThumbsUpIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11v 8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
    </svg>
);
  
const ThumbsDownIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
    </svg>
);

const ShareXIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.31l5.74-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.81 12.95h1.237L3.83 2.05H2.5l9.26 11.65Z"/>
    </svg>
);

const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
    </svg>
);


const CurationControls: React.FC<CurationControlsProps> = ({ 
    rating, onRate, onSubmitFeedback, 
    topic, content, expandedContent, history, historyIndex, t 
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset submission state when the rating is cleared (new content loads)
  useEffect(() => {
    if (rating === null) {
      setIsSubmitted(false);
      setReason('');
    }
  }, [rating]);

  const hasRated = rating !== null;

  const handleRateClick = (newRating: 'up' | 'down') => {
    if (!hasRated) {
      onRate(newRating);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);
    try {
      await onSubmitFeedback(reason);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Feedback submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const path = history.slice(0, historyIndex + 1).join(' → ');
    const url = 'https://generativewiki.com';
    const textIntro = `My discovery path on #GenerativeWiki: ${path}`;
    
    // Twitter's t.co URL shortener makes URLs approx 23 chars.
    // We leave a buffer for safety.
    const remainingChars = 280 - textIntro.length - 23 - 5; // 5 for buffer/spacing
    
    const definitionPrefix = `\n\nDefinition of "${topic}": "`;
    const definitionSuffix = '"';
    
    const fullContent = [content, expandedContent].join(' ').trim();

    let definitionText = '';
    if (fullContent && (remainingChars > definitionPrefix.length + definitionSuffix.length + 20)) { // Only add def if >20 chars of it can be shown
        const maxDefLength = remainingChars - definitionPrefix.length - definitionSuffix.length;
        const truncatedDef = fullContent.length > maxDefLength 
            ? fullContent.substring(0, maxDefLength - 3) + '...'
            : fullContent;
        definitionText = `${definitionPrefix}${truncatedDef}${definitionSuffix}`;
    }

    const fullText = `${textIntro}${definitionText}\n\n${url}`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText.replace(/ and /gi, ' & '))}`;
    
    window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const path = history.slice(0, historyIndex + 1).join(' → ');
    const url = 'https://generativewiki.com';
    const quote = `I discovered "${topic}" on Generative Wiki! My discovery path was: ${path} #GenerativeWiki`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="curation-container">
      {isSubmitted ? (
        <p className="feedback-submitted-message">{t.feedbackThanks}</p>
      ) : (
        <>
          <p className="curation-prompt">{t.rateThisGeneration}</p>
          <div className="curation-buttons">
            <button
              onClick={() => handleRateClick('up')}
              disabled={hasRated}
              className={`rating-up ${rating === 'up' ? 'selected' : ''}`}
              aria-pressed={rating === 'up'}
              aria-label={t.goodGeneration}
            >
              <ThumbsUpIcon />
            </button>
            <button
              onClick={() => handleRateClick('down')}
              disabled={hasRated}
              className={`rating-down ${rating === 'down' ? 'selected' : ''}`}
              aria-pressed={rating === 'down'}
              aria-label={t.badGeneration}
            >
              <ThumbsDownIcon />
            </button>
            <button
              onClick={handleShare}
              className="share-button"
              aria-label="Share on X"
              title="Share on X"
            >
              <ShareXIcon />
            </button>
            <button
              onClick={handleShareFacebook}
              className="share-button"
              aria-label="Share on Facebook"
              title="Share on Facebook"
            >
              <FacebookIcon />
            </button>
          </div>

          {hasRated && (
            <form onSubmit={handleSubmit} className="feedback-form">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.feedbackPlaceholder}
                className="feedback-textarea"
                aria-label={t.feedbackAriaLabel}
              />
              <button type="submit" disabled={isSubmitting} className="feedback-submit-button">
                {isSubmitting ? t.submitting : t.submitFeedback}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default CurationControls;