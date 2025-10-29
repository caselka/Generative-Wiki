/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const DonatePage: React.FC = () => (
  <main>
    <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Support the Project</h2>
    <p>Generative Wiki is a personal project. Running it incurs real costs for API usage and hosting.</p>
    <p>If you enjoy using the site and want to support its continued development, please consider making a donation. Any amount is greatly appreciated and helps keep this experiment online.</p>
    <p>For broad accessibility, you can use a platform like Ko-fi, which is simple and secure for one-time contributions. Cryptocurrency is also a great option for global, decentralized support.</p>
    
    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <a href="https://ko-fi.com/caselka" target="_blank" rel="noopener noreferrer" className="donate-button">
        Support on Ko-fi
      </a>
    </div>

    <div style={{ fontSize: '0.9em', color: '#555' }}>
      <p style={{marginBottom: '0.5rem'}}><strong>Or via Cryptocurrency:</strong></p>
      <p style={{margin: '0.2rem 0', wordBreak: 'break-all'}}><strong>Bitcoin (BTC):</strong> <code>3R1Ha263hJUTc3DWdvvuHYqJxRqC72meAd</code></p>
      <p style={{margin: '0.2rem 0', wordBreak: 'break-all'}}><strong>Ethereum (ETH):</strong> <code>0xf923Fc97e9B9F9f159146bd4C74A080b1540c87C</code></p>
    </div>
  </main>
);

export default DonatePage;