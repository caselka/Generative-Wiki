/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { streamDefinition } from './services/geminiService';
import { submitFeedback, logSearch } from './services/feedbackService';
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
import { useTranslations, LanguageCode } from './i18n';

// A curated list of "banger" words and phrases for the random button.
const PREDEFINED_WORDS = [
  'Balance', 'Harmony', 'Discord', 'Unity', 'Fragmentation', 'Clarity', 'Ambiguity', 'Presence', 'Absence', 'Creation', 'Destruction', 'Light', 'Shadow', 'Beginning', 'Ending', 'Rising', 'Falling', 'Connection', 'Isolation', 'Hope', 'Despair',
  'Order and chaos', 'Light and shadow', 'Sound and silence', 'Form and formlessness', 'Being and nonbeing', 'Presence and absence', 'Motion and stillness', 'Unity and multiplicity', 'Finite and infinite', 'Sacred and profane', 'Memory and forgetting', 'Question and answer', 'Search and discovery', 'Journey and destination', 'Dream and reality', 'Time and eternity', 'Self and other', 'Known and unknown', 'Spoken and unspoken', 'Visible and invisible',
  'Zigzag', 'Waves', 'Spiral', 'Bounce', 'Slant', 'Drip', 'Stretch', 'Squeeze', 'Float', 'Fall', 'Spin', 'Melt', 'Rise', 'Twist', 'Explode', 'Stack', 'Mirror', 'Echo', 'Vibrate',
  'Gravity', 'Friction', 'Momentum', 'Inertia', 'Turbulence', 'Pressure', 'Tension', 'Oscillate', 'Fractal', 'Quantum', 'Entropy', 'Vortex', 'Resonance', 'Equilibrium', 'Centrifuge', 'Elastic', 'Viscous', 'Refract', 'Diffuse', 'Cascade', 'Levitate', 'Magnetize', 'Polarize', 'Accelerate', 'Compress', 'Undulate',
  'Liminal', 'Ephemeral', 'Paradox', 'Zeitgeist', 'Metamorphosis', 'Synesthesia', 'Recursion', 'Emergence', 'Dialectic', 'Apophenia', 'Limbo', 'Flux', 'Sublime', 'Uncanny', 'Palimpsest', 'Chimera', 'Void', 'Transcend', 'Ineffable', 'Qualia', 'Gestalt', 'Simulacra', 'Abyssal',
  'Existential', 'Nihilism', 'Solipsism', 'Phenomenology', 'Hermeneutics', 'Deconstruction', 'Postmodern', 'Absurdism', 'Catharsis', 'Epiphany', 'Melancholy', 'Nostalgia', 'Longing', 'Reverie', 'Pathos', 'Ethos', 'Logos', 'Mythos', 'Anamnesis', 'Intertextuality', 'Metafiction', 'Stream', 'Lacuna', 'Caesura', 'Enjambment',
  
  // Rick and Morty Quotes
  'Wubba lubba dub dub!',
  'Get schwifty',
  'Nobody exists on purpose. Nobody belongs anywhere. We are all going to die. Come watch TV.',
  'To live is to risk it all.',
  'Sometimes science is more art than science.',
  'The universe is a cruel, uncaring void.',
  'Plumbus',

  // Historical & Philosophical Quotes
  'Veni, vidi, vici.',
  'The only thing we have to fear is fear itself.',
  'That is one small step for a man, one giant leap for mankind.',
  'The unexamined life is not worth living.',
  'I think, therefore I am.',
  'What is the sound of one hand clapping?',
  'To be or not to be, that is the question.',

  // Random long sentences & prompts
  'An exploration of the butterfly effect in daily life.',
  'The inherent paradox of a self-aware machine.',
  'A conversation between a star and a black hole.',
  'The last thought of a dying universe.',
  'What happens when an unstoppable force meets an immovable object?',

  // Made up words
  'Glimmerfang',
  'Chrono-scrambler',
  'Quibblesnatch',
  'Flibbertigibbet',
  'Vapor-lock dream',
  'Zorp',
  'Gloob',
  'Synthezoid',
  'Aether-drip',
];
const UNIQUE_WORDS = [...new Set(PREDEFINED_WORDS)];
const HISTORY_CAP = 16;

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [page, setPage] = useState<string>('wiki');
  const [currentRating, setCurrentRating] = useState<'up' | 'down' | null>(null);
  
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

  const currentTopic = history[historyIndex] ?? '';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);


  useEffect(() => {
    if (!currentTopic || page !== 'wiki') return;

    let isCancelled = false;
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent('');
      setGenerationTime(null);
      setCurrentRating(null);
      const startTime = performance.now();
      let accumulatedContent = '';
      try {
        for await (const chunk of streamDefinition(currentTopic, language)) {
          if (isCancelled) break;
          if (chunk.startsWith('Error:')) throw new Error(chunk);
          accumulatedContent += chunk;
          if (!isCancelled) setContent(accumulatedContent);
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

  const navigateToTopic = useCallback((newTopic: string) => {
    const trimmedTopic = newTopic.trim();
    if (!trimmedTopic || trimmedTopic.toLowerCase() === currentTopic.toLowerCase()) return;
    
    let newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(trimmedTopic);

    if (newHistory.length > HISTORY_CAP) {
      newHistory = newHistory.slice(1);
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    logSearch(trimmedTopic);
  }, [history, historyIndex, currentTopic]);

  const handleWordClick = useCallback((word: string) => { navigateToTopic(word); }, [navigateToTopic]);
  const handleSearch = useCallback((topic: string) => { navigateToTopic(topic); }, [navigateToTopic]);

  const handleRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * UNIQUE_WORDS.length);
    let randomWord = UNIQUE_WORDS[randomIndex];
    if (randomWord.toLowerCase() === currentTopic.toLowerCase()) {
      const nextIndex = (randomIndex + 1) % UNIQUE_WORDS.length;
      randomWord = UNIQUE_WORDS[nextIndex];
    }
    navigateToTopic(randomWord);
  }, [currentTopic, navigateToTopic]);

  const handleHistoryClick = (index: number) => {
    if (index !== historyIndex) {
      setHistoryIndex(index);
    }
  };

  const handleNavClick = (newPage: string) => { window.scrollTo(0, 0); setPage(newPage); };
  const handleRating = (newRating: 'up' | 'down') => { setCurrentRating(newRating); };
  
  const handleFeedbackSubmit = async (reason: string) => {
    if (!currentTopic || !currentRating) return;
    try {
        await submitFeedback({ topic: currentTopic, rating: currentRating, reason: reason, output: content });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
  };

  const handleThemeToggle = () => { setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light'); };
  const handleLanguageChange = (newLang: LanguageCode) => { setLanguage(newLang); };

  const renderWikiContent = () => {
    if (historyIndex === -1) {
      return <WelcomeScreen onWordClick={handleWordClick} t={t} />;
    }
    return (
      <>
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
            
            {!isLoading && !error && history.length > 1 && (
              <HistoryList
                history={history}
                currentIndex={historyIndex}
                onHistoryClick={handleHistoryClick}
                t={t}
              />
            )}

            {!isLoading && !error && content.length > 0 && (
              <CurationControls 
                rating={currentRating} 
                onRate={handleRating} 
                onSubmitFeedback={handleFeedbackSubmit}
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
      </>
    );
  };
  
  const renderPage = () => {
    switch(page) {
      case 'about': return <AboutPage />;
      case 'donate': return <DonatePage />;
      case 'privacy': return <PrivacyPage />;
      default: return renderWikiContent();
    }
  };

  return (
    <div>
      {page === 'wiki' && (
        <SearchBar 
          onSearch={handleSearch} 
          onRandom={handleRandom} 
          isLoading={isLoading}
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