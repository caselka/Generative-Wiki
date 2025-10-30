/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { InteractiveText } from './ContentDisplay';
import { Translation } from '../i18n';

interface AboutPageProps {
  onWordClick: (word: string) => void;
  t: Translation;
}

const AboutPage: React.FC<AboutPageProps> = ({ onWordClick, t }) => (
  <main>
    <h2><InteractiveText onWordClick={onWordClick}>{t.aboutTitle}</InteractiveText></h2>
    <p><InteractiveText onWordClick={onWordClick}>{t.aboutP1}</InteractiveText></p>
    <p><InteractiveText onWordClick={onWordClick}>{t.aboutP2}</InteractiveText></p>
    <p><InteractiveText onWordClick={onWordClick}>{t.aboutP3_1}</InteractiveText> <a href="https://github.com/caselka" target="_blank" rel="noopener noreferrer">Caselka</a> <InteractiveText onWordClick={onWordClick}>{t.aboutP3_2}</InteractiveText></p>
    <p><InteractiveText onWordClick={onWordClick}>{t.aboutP4}</InteractiveText></p>
  </main>
);

export default AboutPage;