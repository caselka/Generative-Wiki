/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const AboutPage: React.FC = () => (
  <main>
    <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>About Generative Wiki</h2>
    <p>Generative Wiki is an exploration of knowledge and creativity, powered by Google's Gemini models.</p>
    <p>Unlike a traditional encyclopedia, every word on this site is a hyperlink. Clicking on a word generates a new definition in real-time, creating an endless, interconnected web of information.</p>
    <p>This project was created by <a href="https://github.com/caselka" target="_blank" rel="noopener noreferrer">Caselka</a> as a way to visualize the vast, associative nature of generative AI and create a unique, interactive reading experience.</p>
    <p>The front-end is built with React and TypeScript, and it leverages the streaming capabilities of the Gemini API to deliver content as quickly as possible.</p>
  </main>
);

export default AboutPage;
