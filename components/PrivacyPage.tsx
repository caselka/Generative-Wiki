/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const PrivacyPage: React.FC = () => (
  <main style={{ maxWidth: '800px', margin: '0 auto' }}>
    <h2>Privacy Policy</h2>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Data Collection</h3>
    <p>Generative Wiki collects limited data to improve the user experience and understand how the service is used.</p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Search Analytics</h3>
    <p><strong>What we collect:</strong> When you search for or click on a word, we automatically log:</p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li>Timestamp of the search</li>
      <li>The word or topic you searched for</li>
      <li>Your IP address and approximate location (country, region, city, coordinates)</li>
      <li>Your Internet Service Provider (ISP) information</li>
    </ul>
    <p><strong>Why we collect it:</strong> This helps us understand what topics are popular, where users are located geographically, and how the service is being used.</p>
    <p><strong>Rate limits:</strong> Search logging is limited to 100 searches per hour per user to prevent abuse.</p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>User Feedback</h3>
    <p><strong>What we collect:</strong> When you rate a generated definition (thumbs up/down), we collect:</p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li>Timestamp of the feedback</li>
      <li>The word or topic you rated</li>
      <li>Your rating (positive or negative)</li>
      <li>Optional text feedback explaining your rating</li>
      <li>The full AI-generated content you rated</li>
    </ul>
    <p><strong>Why we collect it:</strong> Feedback helps us improve content quality and understand which AI-generated definitions are helpful.</p>
    <p><strong>Rate limits:</strong> Feedback submissions are limited to 5 per hour per user.</p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Third-Party Services</h3>
    <p>We use the following third-party services:</p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><strong>Google Gemini API:</strong> Generates AI-powered definitions. Your searches are sent to Google's servers to generate content.</li>
      <li><strong>ip-api.com:</strong> Provides geolocation data based on your IP address for analytics purposes.</li>
    </ul>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Data Storage</h3>
    <p>All collected data is stored securely and is accessible only to the site administrator. We do not sell or share your data with third parties for marketing purposes.</p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Your Privacy Rights</h3>
    <p>You can browse Generative Wiki without providing personal information beyond what is automatically collected (IP address, location). If you wish to opt out of analytics:</p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li>Use a VPN to mask your IP address</li>
      <li>Use browser extensions that block geolocation requests</li>
      <li>Use privacy-focused browsers that limit tracking</li>
    </ul>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Cookies and Local Storage</h3>
    <p>We use browser local storage to:</p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li>Remember your theme preference (light/dark mode)</li>
      <li>Remember your language preference</li>
      <li>Enforce rate limits on feedback and analytics submissions</li>
    </ul>
    <p>No tracking cookies are used. All data stored locally remains on your device.</p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Changes to This Policy</h3>
    <p>We may update this privacy policy from time to time. Changes will be posted on this page.</p>
    
    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-color-tertiary)' }}>Last updated: October 29, 2025</p>
  </main>
);

export default PrivacyPage;