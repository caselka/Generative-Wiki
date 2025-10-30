/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { InteractiveText } from './ContentDisplay';
import { Translation } from '../i18n';

interface PrivacyPageProps {
  onWordClick: (word: string) => void;
  t: Translation;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onWordClick, t }) => (
  <main className="text-content-container">
    <h2><InteractiveText onWordClick={onWordClick}>{t.privacyTitle}</InteractiveText></h2>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyDataCollectionTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyDataCollectionP1}</InteractiveText></p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsTitle}</InteractiveText></h3>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyWhatWeCollect}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsP1}</InteractiveText></p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsL1}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsL2}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsL3}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsL4}</InteractiveText></li>
    </ul>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyWhyWeCollect}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsP2}</InteractiveText></p>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyRateLimits}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacySearchAnalyticsP3}</InteractiveText></p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackTitle}</InteractiveText></h3>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyWhatWeCollect}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackP1}</InteractiveText></p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackL1}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackL2}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackL3}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackL4}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackL5}</InteractiveText></li>
    </ul>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyWhyWeCollect}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackP2}</InteractiveText></p>
    <p><strong><InteractiveText onWordClick={onWordClick}>{t.privacyRateLimits}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacyUserFeedbackP3}</InteractiveText></p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyThirdPartyTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyThirdPartyP1}</InteractiveText></p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><strong><InteractiveText onWordClick={onWordClick}>{t.privacyThirdPartyL1_1}</InteractiveText></strong> <InteractiveText onWordClick={onWordClick}>{t.privacyThirdPartyL1_2}</InteractiveText></li>
      <li><strong>ipapi.co:</strong> <InteractiveText onWordClick={onWordClick}>{t.privacyThirdPartyL2}</InteractiveText></li>
    </ul>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyDataStorageTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyDataStorageP1}</InteractiveText></p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyYourRightsTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyYourRightsP1}</InteractiveText></p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyYourRightsL1}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyYourRightsL2}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyYourRightsL3}</InteractiveText></li>
    </ul>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesP1}</InteractiveText></p>
    <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesL1}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesL2}</InteractiveText></li>
      <li><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesL3}</InteractiveText></li>
    </ul>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyCookiesP2}</InteractiveText></p>
    
    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}><InteractiveText onWordClick={onWordClick}>{t.privacyChangesTitle}</InteractiveText></h3>
    <p><InteractiveText onWordClick={onWordClick}>{t.privacyChangesP1}</InteractiveText></p>
    
    <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-color-tertiary)' }}><InteractiveText onWordClick={onWordClick}>{t.privacyLastUpdated}</InteractiveText></p>
  </main>
);

export default PrivacyPage;