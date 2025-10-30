/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { InteractiveText } from './ContentDisplay';
import { Translation, getUpdatesLog, getDocsContent } from '../i18n';

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

const CollapseIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        style={{ 
            width: '0.75em', 
            height: '0.75em', 
            marginLeft: '0.5em', 
            verticalAlign: 'middle',
            transition: 'transform 0.2s ease-in-out',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
        }}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

type SectionKey = keyof ReturnType<typeof getDocsContent>;

interface DocsPageProps {
  hasNewUpdate: boolean;
  onMarkUpdateAsSeen: () => void;
  onWordClick: (word: string) => void;
  t: Translation;
}

const DocsPage: React.FC<DocsPageProps> = ({ hasNewUpdate, onMarkUpdateAsSeen, onWordClick, t }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('introduction');

  const DOCS_CONTENT = getDocsContent(t, onWordClick);
  const UPDATES_LOG = getUpdatesLog(t);

  const [expandedTechDetails, setExpandedTechDetails] = useState<Set<string>>(new Set(UPDATES_LOG.map(u => u.id)));

  const handleNavClick = (section: SectionKey, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveSection(section);
    const contentElement = document.getElementById('docs-content');
    if (contentElement) {
        contentElement.scrollTop = 0;
    }
    if (section === 'updates') {
      onMarkUpdateAsSeen();
    }
  };

  const handleShareUpdate = (update: typeof UPDATES_LOG[0]) => {
    const prefix = `${t.docsSharePrefix} ${update.version}: `;
    const url = 'https://generativewiki.com';
    const mention = '@GenerativeWiki';

    // Twitter's t.co shortener makes URLs ~23 characters.
    // Max tweet length is 280. We calculate remaining space for the summary.
    // Structure: [prefix][summary] [mention]\n\n[url]
    const fixedCharsLength = prefix.length + 1 + mention.length + 2 + 23; // +1 for space, +2 for newlines, 23 for URL
    const maxSummaryLength = 280 - fixedCharsLength;

    let summary = update.summary;
    if (summary.length > maxSummaryLength) {
        summary = summary.substring(0, maxSummaryLength - 3) + '...';
    }

    const text = `${prefix}${summary} ${mention}\n\n${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.replace(/ and /gi, ' & '))}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareUpdateFacebook = (update: typeof UPDATES_LOG[0]) => {
    const url = 'https://generativewiki.com';
    const quote = `Generative Wiki ${update.version} update: ${update.summary}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleTechDetails = (id: string) => {
    setExpandedTechDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const renderUpdates = () => (
    <div className="docs-updates-container">
      {UPDATES_LOG.map(update => (
        <div key={update.id} className="update-entry">
          <div className="update-header">
            <div>
                <h3 className="update-date"><InteractiveText onWordClick={onWordClick}>{update.date}</InteractiveText></h3>
                <span style={{fontSize: '0.9em', color: 'var(--text-color-tertiary)'}}><InteractiveText onWordClick={onWordClick}>{update.version}</InteractiveText></span>
            </div>
            <div className="update-share-buttons">
                <button 
                    onClick={() => handleShareUpdate(update)}
                    className="update-share-button"
                    aria-label="Share this update on X"
                    title="Share on X"
                >
                    <ShareXIcon />
                </button>
                <button 
                    onClick={() => handleShareUpdateFacebook(update)}
                    className="update-share-button"
                    aria-label="Share this update on Facebook"
                    title="Share on Facebook"
                >
                    <FacebookIcon />
                </button>
            </div>
          </div>
          <p className="update-summary"><InteractiveText onWordClick={onWordClick}>{update.summary}</InteractiveText></p>
          <ul className="update-details">
            {update.details.map((item, index) => {
                const parts = item.split(/(\*\*.*?\*\*|`.*?`)/g);
                return (
                    <li key={index}>
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i}><InteractiveText onWordClick={onWordClick}>{part.slice(2, -2)}</InteractiveText></strong>;
                            }
                            if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={i}>{part.slice(1, -1)}</code>;
                            }
                            return <InteractiveText key={i} onWordClick={onWordClick}>{part}</InteractiveText>;
                        })}
                    </li>
                );
            })}
          </ul>
          <p className="update-attribution"><InteractiveText onWordClick={onWordClick}>- Caselka</InteractiveText></p>

          {update.technicalDetails && (
            <>
              <button 
                onClick={() => handleToggleTechDetails(update.id)}
                className="tech-details-toggle"
                aria-expanded={expandedTechDetails.has(update.id)}
              >
                <InteractiveText onWordClick={onWordClick}>{t.docsTechChanges}</InteractiveText>
                <CollapseIcon isCollapsed={!expandedTechDetails.has(update.id)} />
              </button>
              <div className={`tech-details-wrapper ${expandedTechDetails.has(update.id) ? '' : 'collapsed'}`}>
                <div>
                  <ul className="tech-details-list">
                    {update.technicalDetails.map((item, index) => {
                        const htmlContent = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
                        return <li key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
                    })}
                  </ul>
                </div>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );

  const { title } = DOCS_CONTENT[activeSection];
  const content = activeSection === 'updates' ? renderUpdates() : DOCS_CONTENT[activeSection].content;

  return (
    <div className="docs-container">
      <aside className="docs-sidebar">
        <nav>
          <ul>
            {Object.entries(DOCS_CONTENT).map(([key, { title }]) => (
              <li key={key}>
                <a 
                  href={`#${key}`}
                  className={activeSection === key ? 'active' : ''}
                  onClick={(e) => handleNavClick(key as SectionKey, e)}
                >
                  <span>{title}</span>
                  {key === 'updates' && hasNewUpdate && <span className="notification-bubble" title="New updates available"></span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main id="docs-content" className="docs-content">
        <h1>{title}</h1>
        {content}
      </main>
    </div>
  );
};

export default DocsPage;