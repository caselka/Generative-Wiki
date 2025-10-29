/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import {GoogleGenAI} from '@google/genai';
import { LanguageCode } from '../i18n';

if (!process.env.API_KEY) {
  console.error('API_KEY environment variable is not set.');
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
const textModelName = 'gemini-2.5-flash-lite';

const languageMap: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
};

/**
 * Streams a definition for a given topic from the Gemini API in the specified language.
 * @param topic The word or term to define.
 * @param langCode The language code (e.g., 'en', 'es').
 * @returns An async generator that yields text chunks of the definition.
 */
export async function* streamDefinition(
  topic: string,
  langCode: LanguageCode,
): AsyncGenerator<string, void, undefined> {
  if (!process.env.API_KEY) {
    yield 'Error: API_KEY is not configured. Please check your environment variables to continue.';
    return;
  }

  const languageName = languageMap[langCode] || 'English';
  const prompt = `Provide a concise, single-paragraph encyclopedia-style definition for the term: "${topic}". The entire definition must be written in ${languageName}. Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the definition itself.`;

  try {
    const response = await ai.models.generateContentStream({
      model: textModelName,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error('Error streaming from Gemini:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    yield `Error: Could not generate content for "${topic}". ${errorMessage}`;
    throw new Error(errorMessage);
  }
}