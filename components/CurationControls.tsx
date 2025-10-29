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


const CurationControls: React.FC<CurationControlsProps> = ({ rating, onRate, onSubmitFeedback, t }) => {
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