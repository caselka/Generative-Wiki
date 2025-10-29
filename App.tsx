/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { streamDefinition, generateAsciiArt, AsciiArtData } from './services/geminiService';
import ContentDisplay from './components/ContentDisplay';
import SearchBar from './components/SearchBar';
import LoadingSkeleton from './components/LoadingSkeleton';
import AsciiArtDisplay from './components/AsciiArtDisplay';
import AboutPage from './components/AboutPage';
import DonatePage from './components/DonatePage';
import WelcomeScreen from './components/WelcomeScreen';

// A curated list of "banger" words and phrases for the random button.
const PREDEFINED_WORDS = [
  // List 1
  'Balance', 'Harmony', 'Discord', 'Unity', 'Fragmentation', 'Clarity', 'Ambiguity', 'Presence', 'Absence', 'Creation', 'Destruction', 'Light', 'Shadow', 'Beginning', 'Ending', 'Rising', 'Falling', 'Connection', 'Isolation', 'Hope', 'Despair',
  // Complex phrases from List 1
  'Order and chaos', 'Light and shadow', 'Sound and silence', 'Form and formlessness', 'Being and nonbeing', 'Presence and absence', 'Motion and stillness', 'Unity and multiplicity', 'Finite and infinite', 'Sacred and profane', 'Memory and forgetting', 'Question and answer', 'Search and discovery', 'Journey and destination', 'Dream and reality', 'Time and eternity', 'Self and other', 'Known and unknown', 'Spoken and unspoken', 'Visible and invisible',
  // List 2
  'Zigzag', 'Waves', 'Spiral', 'Bounce', 'Slant', 'Drip', 'Stretch', 'Squeeze', 'Float', 'Fall', 'Spin', 'Melt', 'Rise', 'Twist', 'Explode', 'Stack', 'Mirror', 'Echo', 'Vibrate',
  // List 3
  'Gravity', 'Friction', 'Momentum', 'Inertia', 'Turbulence', 'Pressure', 'Tension', 'Oscillate', 'Fractal', 'Quantum', 'Entropy', 'Vortex', 'Resonance', 'Equilibrium', 'Centrifuge', 'Elastic', 'Viscous', 'Refract', 'Diffuse', 'Cascade', 'Levitate', 'Magnetize', 'Polarize', 'Accelerate', 'Compress', 'Undulate',
  // List 4
  'Liminal', 'Ephemeral', 'Paradox', 'Zeitgeist', 'Metamorphosis', 'Synesthesia', 'Recursion', 'Emergence', 'Dialectic', 'Apophenia', 'Limbo', 'Flux', 'Sublime', 'Uncanny', 'Palimpsest', 'Chimera', 'Void', 'Transcend', 'Ineffable', 'Qualia', 'Gestalt', 'Simulacra', 'Abyssal',
  // List 5
  'Existential', 'Nihilism', 'Solipsism', 'Phenomenology', 'Hermeneutics', 'Deconstruction', 'Postmodern', 'Absurdism', 'Catharsis', 'Epiphany', 'Melancholy', 'Nostalgia', 'Longing', 'Reverie', 'Pathos', 'Ethos', 'Logos', 'Mythos', 'Anamnesis', 'Intertextuality', 'Metafiction', 'Stream', 'Lacuna', 'Caesura', 'Enjambment'
];
const UNIQUE_WORDS = [...new Set(PREDEFINED_WORDS)];


/**
 * Creates a simple ASCII art bounding box as a fallback.
 * @param topic The text to display inside the box.
 * @returns An AsciiArtData object with the generated art.
 */
const createFallbackArt = (topic: string): AsciiArtData => {
  const displayableTopic = topic.length > 20 ? topic.substring(0, 17) + '...' : topic;
  const paddedTopic = ` ${displayableTopic} `;
  const topBorder = `┌${'─'.repeat(paddedTopic.length)}┐`;
  const middle = `│${paddedTopic}│`;
  const bottomBorder = `└${'─'.repeat(paddedTopic.length)}┘`;
  return {
    art: `${topBorder}\n${middle}\n${bottomBorder}`
  };
};

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<AsciiArtData | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [page, setPage] = useState<string>('wiki');

  const currentTopic = history[historyIndex] ?? '';
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  useEffect(() => {
    if (!currentTopic || page !== 'wiki') return;

    let isCancelled = false;

    const fetchContentAndArt = async () => {
      setIsLoading(true);
      setError(null);
      setContent('');
      setAsciiArt(null);
      setGenerationTime(null);
      const startTime = performance.now();

      generateAsciiArt(currentTopic)
        .then(art => {
          if (!isCancelled) setAsciiArt(art);
        })
        .catch(err => {
          if (!isCancelled) {
            console.error("Failed to generate ASCII art:", err);
            setAsciiArt(createFallbackArt(currentTopic));
          }
        });

      let accumulatedContent = '';
      try {
        for await (const chunk of streamDefinition(currentTopic)) {
          if (isCancelled) break;
          
          if (chunk.startsWith('Error:')) throw new Error(chunk);
          
          accumulatedContent += chunk;
          if (!isCancelled) setContent(accumulatedContent);
        }
      } catch (e: unknown) {
        if (!isCancelled) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
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

    fetchContentAndArt();
    
    return () => { isCancelled = true; };
  }, [currentTopic, page]);

  const navigateToTopic = useCallback((newTopic: string) => {
    const trimmedTopic = newTopic.trim();
    if (!trimmedTopic || trimmedTopic.toLowerCase() === currentTopic.toLowerCase()) return;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(trimmedTopic);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, currentTopic]);

  const handleWordClick = useCallback((word: string) => {
    navigateToTopic(word);
  }, [navigateToTopic]);

  const handleSearch = useCallback((topic: string) => {
    navigateToTopic(topic);
  }, [navigateToTopic]);

  const handleRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * UNIQUE_WORDS.length);
    let randomWord = UNIQUE_WORDS[randomIndex];

    if (randomWord.toLowerCase() === currentTopic.toLowerCase()) {
      const nextIndex = (randomIndex + 1) % UNIQUE_WORDS.length;
      randomWord = UNIQUE_WORDS[nextIndex];
    }
    navigateToTopic(randomWord);
  }, [currentTopic, navigateToTopic]);

  const handleBack = () => {
    if (canGoBack) setHistoryIndex(historyIndex - 1);
  };

  const handleForward = () => {
    if (canGoForward) setHistoryIndex(historyIndex + 1);
  };
  
  const handleNavClick = (newPage: string) => {
    window.scrollTo(0, 0);
    setPage(newPage);
  };

  const renderWikiContent = () => {
    if (historyIndex === -1) {
      return <WelcomeScreen onWordClick={handleWordClick} />;
    }
    return (
      <>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            GENERATIVE WIKI
          </h1>
          <AsciiArtDisplay artData={asciiArt} topic={currentTopic} />
        </header>
        
        <main>
          <div>
            <h2 style={{ marginBottom: '2rem', textTransform: 'capitalize' }}>
              {currentTopic}
            </h2>
            {error && (
              <div style={{ border: '1px solid #cc0000', padding: '1rem', color: '#cc0000' }}>
                <p style={{ margin: 0 }}>An Error Occurred</p>
                <p style={{ marginTop: '0.5rem', margin: 0 }}>{error}</p>
              </div>
            )}
            {isLoading && content.length === 0 && !error && <LoadingSkeleton />}
            {content.length > 0 && !error && (
               <ContentDisplay 
                 content={content} 
                 isLoading={isLoading} 
                 onWordClick={handleWordClick} 
               />
            )}
            {!isLoading && !error && content.length === 0 && (
              <div style={{ color: '#888', padding: '2rem 0' }}>
                <p>Content could not be generated.</p>
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
          onBack={handleBack}
          onForward={handleForward}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
      )}
      
      {renderPage()}

      <footer className="sticky-footer">
        <p className="footer-text" style={{ margin: 0 }}>
          Generative Wiki by <a href="https://github.com/caselka" target="_blank" rel="noopener noreferrer">Caselka</a>
          {page === 'wiki' && currentTopic && generationTime && ` · ${Math.round(generationTime)}ms`}
        </p>
         <nav className="footer-nav">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('wiki'); }}>Wiki</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('donate'); }}>Donate</a>
        </nav>
      </footer>
    </div>
  );
};

export default App;