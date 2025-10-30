/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { streamDefinition, streamDeeperArticle, getSynonyms } from './services/geminiService';
import { submitFeedback, logSearch, logDeepSearch } from './services/feedbackService';
import ContentDisplay from './components/ContentDisplay';
import SearchBar from './components/SearchBar';
import LoadingSkeleton from './components/LoadingSkeleton';
import AboutPage from './components/AboutPage';
import DonatePage from './components/DonatePage';
import PrivacyPage from './components/PrivacyPage';
import WelcomeScreen from './components/WelcomeScreen';
import CurationControls from './components/CurationControls';
import Settings from './components/Settings';
import HistoryList from './components/HistoryList';
import SourcesDisplay from './components/SourcesDisplay';
import DeepSearchAnimation from './components/DeepSearchAnimation';
import SelectionPopup from './components/SelectionPopup';
import DocsPage from './components/DocsPage';
import AsciiArtDisplay from './components/AsciiArtDisplay';
import { useTranslations, LanguageCode, getUpdatesLog } from './i18n';
import { UNIQUE_WORDS } from './data/predefinedWords';

const HISTORY_CAP = 16;

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

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [content, setContent] = useState<string>('');
  const [expandedContent, setExpandedContent] = useState<string>('');
  const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchingDeeper, setIsSearchingDeeper] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isArticleMinimized, setIsArticleMinimized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [page, setPage] = useState<string>('wiki');
  const [currentRating, setCurrentRating] = useState<'up' | 'down' | null>(null);
  const [hasNewUpdate, setHasNewUpdate] = useState<boolean>(false);
  const [popupConfig, setPopupConfig] = useState<{ text: string; top: number; left: number } | null>(null);
  const [synonyms, setSynonyms] = useState<string[] | null>(null);
  const [isFetchingSynonyms, setIsFetchingSynonyms] = useState<boolean>(false);
  const [isHistoryOpenMobile, setIsHistoryOpenMobile] = useState(true);
  const [isSynonymsOpenMobile, setIsSynonymsOpenMobile] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang as LanguageCode) || 'en';
  });

  const t = useTranslations(language);
  const UPDATES_LOG = getUpdatesLog(t);
  
  const deepSearchStreamCleaner = useRef<(() => void) | null>(null);

  const currentTopic = history[historyIndex] ?? '';

  useEffect(() => {
    const latestUpdateId = UPDATES_LOG[0]?.id;
    if (latestUpdateId) {
        const lastSeenUpdateId = localStorage.getItem('lastSeenUpdateId');
        if (latestUpdateId !== lastSeenUpdateId) {
            setHasNewUpdate(true);
        }
    }
  }, [UPDATES_LOG]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      if (page === 'docs' || page === 'privacy' || (page === 'wiki' && historyIndex !== -1)) {
        rootElement.classList.add('wide-view');
      } else {
        rootElement.classList.remove('wide-view');
      }
    }
  }, [page, historyIndex]);

  useEffect(() => {
    const showPopupForSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection ? selection.toString().trim() : '';
  
      if (!selectedText || !/\p{L}/u.test(selectedText)) {
        return;
      }
  
      // Use the selection's own properties to determine its location,
      // which is more reliable across devices than event.target.
      if (selection && selection.rangeCount > 0 && selection.anchorNode) {
        const parentElement = selection.anchorNode.nodeType === Node.TEXT_NODE 
          ? selection.anchorNode.parentElement 
          : selection.anchorNode as HTMLElement;
        
        const interactiveParent = parentElement?.closest('main, .docs-content');

        if (interactiveParent) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
  
          // Don't show for tiny selections that are likely accidental
          if (rect.width < 2 && rect.height < 2) {
            return;
          }
  
          setPopupConfig({
            text: selectedText,
            top: rect.top + window.scrollY - 45,
            left: rect.left + window.scrollX + rect.width / 2,
          });
        }
      }
    };

    const handlePointerUp = () => {
        // Delay slightly to allow the browser's selection object to update.
        setTimeout(showPopupForSelection, 50);
    };
  
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (popupConfig && !target.closest('.selection-popup')) {
        setPopupConfig(null);
      }
    };
  
    // Use pointer events for universal mouse, touch, and pen support.
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerdown', handlePointerDown);
  
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [popupConfig]);


  useEffect(() => {
    if (!currentTopic || page !== 'wiki') return;

    let isCancelled = false;
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent('');
      setSources([]);
      setIsSearchingDeeper(false);
      setGenerationTime(null);
      setCurrentRating(null);
      const startTime = performance.now();
      let accumulatedContent = '';
      try {
        for await (const result of streamDefinition(currentTopic, language)) {
          if (isCancelled) break;
          if (result.error) throw new Error(result.error);
          
          if (result.chunk) {
            accumulatedContent += result.chunk;
            if (!isCancelled) setContent(accumulatedContent);
          }
          if (result.sources) {
            if (!isCancelled) {
              setSources(prev => {
                const combined = [...prev, ...result.sources!];
                return combined.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);
              });
            }
          }
        }
      } catch (e: unknown) {
        if (!isCancelled) {
          const errorMessage = e instanceof Error ? e.message : t.unknownError;
          setError(errorMessage);
          setContent('');
          console.error(e);
        }
      } finally {
        if (!isCancelled) {
          const endTime = performance.now();
          setGenerationTime(endTime - startTime);
          setIsLoading(false);
        }
      }
    };
    fetchContent();
    return () => { isCancelled = true; };
  }, [currentTopic, page, language, t.unknownError]);

  useEffect(() => {
    if (!currentTopic || page !== 'wiki') {
        setSynonyms(null);
        return;
    };

    let isCancelled = false;
    const fetchSynonyms = async () => {
        setIsFetchingSynonyms(true);
        setSynonyms(null);
        try {
            const synonymData = await getSynonyms(currentTopic, language);
            if (!isCancelled) {
                setSynonyms(synonymData);
            }
        } catch (e) {
            console.error(e);
            if (!isCancelled) {
                setSynonyms(null);
            }
        } finally {
            if (!isCancelled) {
                setIsFetchingSynonyms(false);
            }
        }
    };

    fetchSynonyms();

    return () => { isCancelled = true; };
  }, [currentTopic, page, language]);

  const navigateToTopic = useCallback((newTopic: string) => {
    const trimmedTopic = newTopic.trim();
    if (!trimmedTopic || trimmedTopic.toLowerCase() === currentTopic.toLowerCase()) return;

    // Cancel any ongoing deep search before navigating.
    if (deepSearchStreamCleaner.current) {
      deepSearchStreamCleaner.current();
      deepSearchStreamCleaner.current = null;
    }

    // Clear expanded content state immediately on new navigation
    setExpandedContent('');
    setIsExpanded(false);
    setIsSearchingDeeper(false); // Reset loading state
    setIsArticleMinimized(false);
    setSynonyms(null);
    
    let newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(trimmedTopic);

    if (newHistory.length > HISTORY_CAP) {
      newHistory = newHistory.slice(1);
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    // Defer logging to prioritize content loading and UI updates.
    setTimeout(() => logSearch(trimmedTopic), 100);
  }, [history, historyIndex, currentTopic]);

  const handleWordClick = useCallback((word: string) => { navigateToTopic(word); }, [navigateToTopic]);
  const handleSearch = useCallback((topic: string) => { navigateToTopic(topic); }, [navigateToTopic]);

  const handleRandom = useCallback(() => {
    const wordList = UNIQUE_WORDS[language] || UNIQUE_WORDS.en;
    const randomIndex = Math.floor(Math.random() * wordList.length);
    let randomWord = wordList[randomIndex];
    if (randomWord.toLowerCase() === currentTopic.toLowerCase()) {
      const nextIndex = (randomIndex + 1) % wordList.length;
      randomWord = wordList[nextIndex];
    }
    navigateToTopic(randomWord);
  }, [currentTopic, navigateToTopic, language]);

  const handleHistoryClick = (index: number) => {
    if (index !== historyIndex) {
      setHistoryIndex(index);
    }
  };

  const handleNavClick = useCallback((newPage: string) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  }, []);

  const handleGlobalWordClick = useCallback((word: string) => {
    if (page !== 'wiki') {
      handleNavClick('wiki');
    }
    navigateToTopic(word);
  }, [navigateToTopic, page, handleNavClick]);

  const handlePopupSearch = useCallback((text: string) => {
    handleGlobalWordClick(text);
    setPopupConfig(null);
  }, [handleGlobalWordClick]);

  const handleMarkUpdateAsSeen = useCallback(() => {
    const latestUpdateId = UPDATES_LOG[0]?.id;
    if (latestUpdateId) {
        localStorage.setItem('lastSeenUpdateId', latestUpdateId);
        setHasNewUpdate(false);
    }
  }, [UPDATES_LOG]);

  const handleRating = (newRating: 'up' | 'down') => { setCurrentRating(newRating); };
  
  const handleFeedbackSubmit = async (reason: string) => {
    if (!currentTopic || !currentRating) return;
    try {
        await submitFeedback({ 
          topic: currentTopic, 
          rating: currentRating, 
          reason: reason, 
          definition: content,
          expandedArticle: expandedContent,
          wasDeepSearchUsed: !!expandedContent,
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
  };

  const handleThemeToggle = () => { setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light'); };
  const handleLanguageChange = (newLang: LanguageCode) => { setLanguage(newLang); };

  const handleSearchDeeperClick = async () => {
    if (!currentTopic || isSearchingDeeper) return;
    
    // Defer logging to prioritize content loading and UI updates.
    setTimeout(() => logDeepSearch(currentTopic), 100);
  
    let isCancelled = false;
    // Set up the cancellation closure.
    deepSearchStreamCleaner.current = () => { isCancelled = true; };

    setIsSearchingDeeper(true);
    let accumulatedContent = '';
    setExpandedContent('');
    setIsExpanded(false);
  
    try {
      for await (const result of streamDeeperArticle(currentTopic, language)) {
        if (isCancelled) break;
        if (result.error) throw new Error(result.error);

        if (result.chunk) {
          accumulatedContent += result.chunk;
          if (!isCancelled) setExpandedContent(accumulatedContent);
        }
        if (result.sources) {
          if (!isCancelled) {
            setSources(prev => {
              const combined = [...prev, ...result.sources!];
              return combined.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);
            });
          }
        }
      }
    } catch (e: unknown) {
      if (!isCancelled) {
        const errorMessage = e instanceof Error ? e.message : t.unknownError;
        setExpandedContent(`\n\n**${t.errorOccurred}:** ${errorMessage}`);
        console.error(e);
      }
    } finally {
      // Only update state if the process was not cancelled.
      if (!isCancelled) {
        setIsSearchingDeeper(false);
        setIsExpanded(true);
      }
      // Clean up the ref regardless.
      deepSearchStreamCleaner.current = null;
    }
  };
  
  const handleToggleMinimize = () => setIsArticleMinimized(p => !p);

  const renderWikiContent = () => {
    if (historyIndex === -1) {
      return <WelcomeScreen onWordClick={handleWordClick} t={t} language={language} />;
    }

    return (
      <div className="wiki-layout-grid">
        <aside className="left-sidebar">
          {history.length > 1 && (
            <>
              <button className="mobile-accordion-header" onClick={() => setIsHistoryOpenMobile(p => !p)} aria-expanded={isHistoryOpenMobile}>
                <span>{t.historyTitle}</span>
                <CollapseIcon isCollapsed={!isHistoryOpenMobile} />
              </button>
              <div className={`mobile-accordion-content-wrapper ${!isHistoryOpenMobile ? 'collapsed' : ''}`}>
                <HistoryList
                  history={history}
                  currentIndex={historyIndex}
                  onHistoryClick={handleHistoryClick}
                  t={t}
                />
              </div>
            </>
          )}
        </aside>

        <main>
          <div>
            <h1>{currentTopic}</h1>
            {error && (
              <div style={{ border: '1px solid #cc0000', padding: '1rem', color: '#cc0000' }}>
                <p style={{ margin: 0 }}>{t.errorOccurred}</p>
                <p style={{ marginTop: '0.5rem', margin: 0 }}>{error}</p>
              </div>
            )}
            {isLoading && content.length === 0 && !error && <LoadingSkeleton />}
            {content.length > 0 && !error && (
               <ContentDisplay content={content} isLoading={isLoading} onWordClick={handleWordClick} />
            )}

            {!isLoading && !error && content.length > 0 && (
              <>
                <div className="expand-container">
                  {!isExpanded && !isSearchingDeeper && (
                    <button onClick={handleSearchDeeperClick} disabled={isSearchingDeeper} className="expand-button">
                      {t.searchDeeper}
                    </button>
                  )}
                  {isSearchingDeeper && (
                     <button disabled className="expand-button">
                      {t.searchingDeeper}
                    </button>
                  )}
                  {isExpanded && !isSearchingDeeper && (
                    <button onClick={handleToggleMinimize} className="expand-button">
                      {isArticleMinimized ? t.showDetails : t.minimizeDetails}
                    </button>
                  )}
                </div>

                {(isSearchingDeeper || isExpanded) && (
                  <>
                    <hr className="content-divider" />
                    <div className={`expanded-content-wrapper ${isExpanded && isArticleMinimized ? 'minimized' : ''}`}>
                      <div>
                        {isSearchingDeeper && expandedContent.length === 0 && <DeepSearchAnimation t={t} />}
                        {expandedContent.length > 0 && (
                            <ContentDisplay content={expandedContent} isLoading={isSearchingDeeper} onWordClick={handleWordClick} />
                        )}
                        {isExpanded && !isSearchingDeeper && expandedContent.length === 0 && (
                           <p style={{ color: 'var(--text-color-secondary)', textAlign: 'center' }}>
                           {t.expansionNoResults}
                         </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            
            {!isLoading && !error && sources.length > 0 && (
              <SourcesDisplay sources={sources} t={t} />
            )}

            {!isLoading && !error && content.length > 0 && (
              <CurationControls 
                rating={currentRating} 
                onRate={handleRating} 
                onSubmitFeedback={handleFeedbackSubmit}
                topic={currentTopic}
                content={content}
                expandedContent={expandedContent}
                history={history}
                historyIndex={historyIndex}
                t={t}
              />
            )}
            {!isLoading && !error && content.length === 0 && (
              <div style={{ color: '#888', padding: '2rem 0' }}>
                <p>{t.contentCouldNotBeGenerated}</p>
              </div>
            )}
          </div>
        </main>

        <aside className="right-sidebar">
          <button className="mobile-accordion-header" onClick={() => setIsSynonymsOpenMobile(p => !p)} aria-expanded={isSynonymsOpenMobile}>
            <span>{t.synonymsTitle}</span>
            <CollapseIcon isCollapsed={!isSynonymsOpenMobile} />
          </button>
          <div className={`mobile-accordion-content-wrapper ${!isSynonymsOpenMobile ? 'collapsed' : ''}`}>
            <AsciiArtDisplay
              topic={currentTopic}
              synonyms={synonyms}
              isLoading={isFetchingSynonyms}
              onWordClick={handleWordClick}
            />
          </div>
        </aside>
      </div>
    );
  };
  
  const renderPage = () => {
    switch(page) {
      case 'about': return <AboutPage onWordClick={handleGlobalWordClick} t={t} />;
      case 'donate': return <DonatePage onWordClick={handleGlobalWordClick} t={t} />;
      case 'privacy': return <PrivacyPage onWordClick={handleGlobalWordClick} t={t} />;
      case 'docs': return <DocsPage onWordClick={handleGlobalWordClick} hasNewUpdate={hasNewUpdate} onMarkUpdateAsSeen={handleMarkUpdateAsSeen} t={t} />;
      default: return renderWikiContent();
    }
  };

  return (
    <div>
      {popupConfig && (
        <SelectionPopup 
          config={popupConfig}
          onSearch={handlePopupSearch}
          onClose={() => setPopupConfig(null)}
          t={t}
        />
      )}

      {page === 'wiki' && (
        <SearchBar 
          onSearch={handleSearch} 
          onRandom={handleRandom} 
          isLoading={isLoading || isSearchingDeeper}
          t={t}
        />
      )}
      
      {renderPage()}

      <footer className="sticky-footer">
        <p className="footer-text">
          {t.footerText} <a href="https://github.com/caselka" target="_blank" rel="noopener noreferrer">Caselka</a>
          {page === 'wiki' && currentTopic && generationTime && ` · ${Math.round(generationTime)}ms`}
        </p>
         <nav className="footer-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('wiki'); }}>{t.navWiki}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>{t.navAbout}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('docs'); }}>
              {t.navDocs}
              {hasNewUpdate && <span className="notification-bubble"></span>}
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('donate'); }}>{t.navDonate}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('privacy'); }}>{t.navPrivacy}</a>
            <a href="https://github.com/caselka/Generative-Wiki" target="_blank" rel="noopener noreferrer">{t.navGitHub}</a>
            <a href="https://x.com/GenerativeWiki" target="_blank" rel="noopener noreferrer">{t.navX}</a>
        </nav>
        <Settings
          theme={theme}
          onThemeToggle={handleThemeToggle}
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </footer>
    </div>
  );
};

export default App;