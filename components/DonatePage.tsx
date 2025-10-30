/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { InteractiveText } from './ContentDisplay';
import { Translation } from '../i18n';

interface DonatePageProps {
  onWordClick: (word: string) => void;
  t: Translation;
}

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const CryptoAddress: React.FC<{ name: string; address: string; t: Translation }> = ({ name, address, t }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy address: ', err);
    });
  };

  return (
    <div className="crypto-address-container">
      <p>
        <strong>{name}:</strong> <code>{address}</code>
      </p>
      <button 
        onClick={handleCopy} 
        className="copy-button" 
        aria-label={`${t.donateCopy} ${name} ${t.donateAddress}`}
        title={copied ? t.donateCopied : `${t.donateCopy} ${name} ${t.donateAddress}`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
};

const DonatePage: React.FC<DonatePageProps> = ({ onWordClick, t }) => (
  <main>
    <h2><InteractiveText onWordClick={onWordClick}>{t.donateTitle}</InteractiveText></h2>
    <p><InteractiveText onWordClick={onWordClick}>{t.donateP1}</InteractiveText></p>
    <p><InteractiveText onWordClick={onWordClick}>{t.donateP2}</InteractiveText></p>

    <h3 style={{ marginTop: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}><InteractiveText onWordClick={onWordClick}>{t.donateCostTitle}</InteractiveText></h3>
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>{t.donateCostItem1}</span>
          <span>$25</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>{t.donateCostItem2}</span>
          <span>$45 ({t.donateEstimate})</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>{t.donateCostItem3}</span>
          <span>$25</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <span>{t.donateCostItem4}</span>
          <span>$35</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', fontWeight: 'bold' }}>
          <span>{t.donateSubtotal}</span>
          <span>$130</span>
        </li>
      </ul>
      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>{t.donateDevCost}</span>
          <span>$5,000+</span>
        </li>
      </ul>
      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', borderTop: '2px solid var(--text-color)' }}>
         <li style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.1em' }}>
          <span>{t.donateTotal}</span>
          <span>$5,130+</span>
        </li>
      </ul>
    </div>
    
    <p style={{ marginTop: '2.5rem', textAlign: 'center' }}>
      <InteractiveText onWordClick={onWordClick}>{t.donateP3}</InteractiveText>
    </p>
    
    <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
      <a href="https://ko-fi.com/caselka" target="_blank" rel="noopener noreferrer" className="donate-button">
        {t.donateButton}
      </a>
    </div>

    <div style={{ fontSize: '0.9em', color: 'var(--text-color-secondary)' }}>
      <p style={{marginBottom: '1rem'}}><strong><InteractiveText onWordClick={onWordClick}>{t.donateCryptoTitle}</InteractiveText></strong></p>
      <CryptoAddress name="Bitcoin (BTC)" address="3R1Ha263hJUTc3DWdvvuHYqJxRqC72meAd" t={t} />
      <CryptoAddress name="Ethereum (ETH)" address="0xf923Fc97e9B9F9f159146bd4C74A080b1540c87C" t={t} />
    </div>
  </main>
);

export default DonatePage;