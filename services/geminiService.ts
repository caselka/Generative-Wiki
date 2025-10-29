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
const textModelName = 'gemini-flash-lite-latest';

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
    
    let detailedMessage = 'An unknown error occurred.';
    
    if (error instanceof Error && error.message) {
      let messageToParse = error.message;
      
      const jsonStartIndex = messageToParse.indexOf('{');
      if (jsonStartIndex > -1) {
        messageToParse = messageToParse.substring(jsonStartIndex);
      }

      try {
        const apiError = JSON.parse(messageToParse);
        if (apiError.error?.status === 'RESOURCE_EXHAUSTED') {
          detailedMessage = "Whoa there, tiger... this is a free service, too many tokens being burned! Come back later. Consider donating to keep Generative Wiki online for longer!";
        } else if (apiError.error?.message) {
          detailedMessage = apiError.error.message;
        } else {
          detailedMessage = error.message;
        }
      } catch (e) {
        detailedMessage = error.message;
      }
    } else if (typeof error === 'string') {
        detailedMessage = error;
    }
    
    const errorMessage = `Could not generate content for "${topic}". ${detailedMessage}`;
    yield `Error: ${errorMessage}`;
    throw new Error(errorMessage);
  }
}