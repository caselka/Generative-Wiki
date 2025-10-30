/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import {GoogleGenAI, Type} from '@google/genai';
import { LanguageCode } from '../i18n';

if (!process.env.API_KEY) {
  console.error('API_KEY environment variable is not set.');
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
const baseModelName = 'gemini-flash-lite-latest';
const proModelName = 'gemini-2.5-pro';

const languageMap: Record<LanguageCode, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  zh: 'Mandarin Chinese',
  ar: 'Arabic',
};

export interface StreamResult {
  chunk?: string;
  sources?: { uri: string; title: string }[];
  error?: string;
}

async function* streamContent(
  prompt: string,
  topic: string,
  modelName: string,
  config: any,
): AsyncGenerator<StreamResult, void, undefined> {
  if (!process.env.API_KEY) {
    yield { error: 'Error: API_KEY is not configured. Please check your environment variables to continue.' };
    return;
  }

  try {
    const response = await ai.models.generateContentStream({
      model: modelName,
      contents: prompt,
      config: config,
    });

    const seenUris = new Set<string>();

    for await (const chunk of response) {
      if (chunk.text) {
        yield { chunk: chunk.text };
      }
      
      const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const newSources = groundingChunks
          .map(c => c.web)
          .filter(Boolean)
          .filter(source => source.uri && !seenUris.has(source.uri));

        if (newSources.length > 0) {
          newSources.forEach(source => seenUris.add(source.uri!));
          yield { sources: newSources.map(s => ({uri: s.uri!, title: s.title!})) };
        }
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
    yield { error: `Error: ${errorMessage}` };
  }
}

/**
 * Streams a definition for a given topic from the Gemini API in the specified language.
 * @param topic The word or term to define.
 * @param langCode The language code (e.g., 'en', 'es').
 * @returns An async generator that yields text chunks of the definition.
 */
export function streamDefinition(
  topic: string,
  langCode: LanguageCode,
): AsyncGenerator<StreamResult, void, undefined> {
  const languageName = languageMap[langCode] || 'English';
  const prompt = `Provide a concise, single-paragraph encyclopedia-style definition for the term: "${topic}". The entire definition must be written in ${languageName}. Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the definition itself.`;
  return streamContent(prompt, topic, baseModelName, {
    tools: [{googleSearch: {}}],
    thinkingConfig: { thinkingBudget: 0 },
  });
}

/**
 * Streams a deeply researched article by using a more powerful model and thinking budget.
 * @param topic The word or term to write an article about.
 * @param langCode The language code for the article.
 * @returns An async generator that yields text chunks of the article.
 */
export function streamDeeperArticle(
    topic: string,
    langCode: LanguageCode,
  ): AsyncGenerator<StreamResult, void, undefined> {
    const languageName = languageMap[langCode] || 'English';
    const prompt = `Perform a comprehensive analysis of the term: "${topic}". Synthesize information from multiple reliable web sources. Compare different perspectives or definitions if they exist. Provide a detailed, well-structured article that explains the topic thoroughly. The article must be written in ${languageName}. Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the article itself.`;
    return streamContent(prompt, topic, proModelName, {
      tools: [{googleSearch: {}}],
      thinkingConfig: { thinkingBudget: 4096 },
    });
}

/**
 * Fetches a list of synonyms for a given topic.
 * @param topic The word or concept to find synonyms for.
 * @param langCode The language for the synonyms.
 * @returns A promise that resolves to an array of synonyms, or null on failure.
 */
export async function getSynonyms(topic: string, langCode: LanguageCode): Promise<string[] | null> {
    if (!process.env.API_KEY) {
        console.error('Synonym fetch skipped: API_KEY is not configured.');
        return null;
    }
    try {
        const languageName = languageMap[langCode] || 'English';
        const prompt = `Provide up to 5 common synonyms for the word "${topic}". The synonyms must be in ${languageName}.`;

        const response = await ai.models.generateContent({
            model: baseModelName,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        synonyms: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: `An array of up to 5 synonyms for the word ${topic}.`,
                        },
                    },
                    required: ['synonyms'],
                },
            },
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        return result.synonyms || [];

    } catch (error) {
        console.error(`Failed to fetch synonyms for "${topic}":`, error);
        return null;
    }
}