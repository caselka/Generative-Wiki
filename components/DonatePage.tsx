/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';

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


const CryptoAddress: React.FC<{ name: string; address: string }> = ({ name, address }) => {
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
        aria-label={`Copy ${name} address`} 
        title={copied ? 'Copied!' : `Copy ${name} address`}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
};

const DonatePage: React.FC = () => (
  <main>
    <h2>Support the Project</h2>
    <p>Generative Wiki is a passion project, but it has real-world operational costs. Your support directly contributes to its maintenance and growth, helping to cover expenses and sustain its development.</p>
    <p>If you find value in this experiment, please consider making a donation. Every contribution, no matter the size, helps keep the servers running and the project evolving.</p>

    <h3 style={{ marginTop: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Monthly Cost Breakdown (USD)</h3>
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>Web Hosting & Domain</span>
          <span>$25</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>Social Account Verification</span>
          <span>$45 (Est.)</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>User Experience Analytics</span>
          <span>$25</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
          <span>Basic Marketing</span>
          <span>$35</span>
        </li>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', fontWeight: 'bold' }}>
          <span>Service Subtotal</span>
          <span>$130</span>
        </li>
      </ul>
      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
        <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
          <span>Development & Maintenance</span>
          <span>$5,000+</span>
        </li>
      </ul>
      <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem', borderTop: '2px solid var(--text-color)' }}>
         <li style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.1em' }}>
          <span>Total Monthly Cost</span>
          <span>$5,130+</span>
        </li>
      </ul>
    </div>
    
    <p style={{ marginTop: '2.5rem', textAlign: 'center' }}>
      Your contribution helps cover these costs and ensures the project's longevity.
    </p>
    
    <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
      <a href="https://ko-fi.com/caselka" target="_blank" rel="noopener noreferrer" className="donate-button">
        Support on Ko-fi
      </a>
    </div>

    <div style={{ fontSize: '0.9em', color: 'var(--text-color-secondary)' }}>
      <p style={{marginBottom: '1rem'}}><strong>Or via Cryptocurrency:</strong></p>
      <CryptoAddress name="Bitcoin (BTC)" address="3R1Ha263hJUTc3DWdvvuHYqJxRqC72meAd" />
      <CryptoAddress name="Ethereum (ETH)" address="0xf923Fc97e9B9F9f159146bd4C74A080b1540c87C" />
    </div>
  </main>
);

export default DonatePage;