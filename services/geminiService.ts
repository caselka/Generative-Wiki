/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import {GoogleGenAI, Type} from '@google/genai';
import { LanguageCode } from '../i18n';
import { UNIQUE_WORDS } from '../data/predefinedWords';

if (!process.env.API_KEY) {
  console.error('API_KEY environment variable is not set.');
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});
const liteModelName = 'gemini-flash-lite-latest';
const flashModelName = 'gemini-2.5-flash';
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
 * This function dynamically selects a model and prompt based on query complexity.
 * @param topic The word or term to define.
 * @param langCode The language code (e.g., 'en', 'es').
 * @param isSensitive Whether the topic is on a sensitive subject.
 * @returns An async generator that yields text chunks of the definition.
 */
export function streamDefinition(
  topic: string,
  langCode: LanguageCode,
  isSensitive: boolean,
): AsyncGenerator<StreamResult, void, undefined> {
  const languageName = languageMap[langCode] || 'English';
  
  const wordCount = topic.trim().split(/\s+/).length;
  const QUERY_WORD_COUNT_THRESHOLD = 5;

  let modelToUse: string;
  let prompt: string;
  let config: any;

  if (wordCount <= QUERY_WORD_COUNT_THRESHOLD) {
    // For short queries, assume it's a term and prioritize speed with the lite model.
    modelToUse = liteModelName;
    prompt = `Provide a concise, single-paragraph encyclopedia-style definition for the term: "${topic}". Prioritize the most current and widely recognized information about the topic. If the term is ambiguous, define the most prominent entity it refers to. The entire definition must be written in ${languageName}. Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the definition itself.`;
    config = {
      tools: [{googleSearch: {}}],
      thinkingConfig: { thinkingBudget: 0 },
    };
  } else {
    // For longer queries, assume it's a question or complex topic.
    // Use a more capable model and a small thinking budget for better accuracy.
    modelToUse = flashModelName;
    prompt = `You are a helpful encyclopedia. Provide a comprehensive, neutral, and informative answer to the following user query: "${topic}". Synthesize information to provide a direct and factual response. The entire response must be written in ${languageName}. Do not use markdown, titles, or any special formatting. Respond with only the text of the answer itself.`;
    config = {
      tools: [{googleSearch: {}}],
      thinkingConfig: { thinkingBudget: 1024 },
    };
  }

  if (isSensitive) {
    const sensitivePreamble = `IMPORTANT: The user's query is on a sensitive topic related to potential harm. While providing an accurate and neutral response, you MUST also include a concluding sentence that gently encourages users who might be struggling to seek help and provides a universally recognized resource (like Befrienders Worldwide, a crisis hotline, or a mental health support website). `;
    prompt = sensitivePreamble + prompt;
  }
  
  return streamContent(prompt, topic, modelToUse, config);
}

/**
 * Streams a deeply researched article by using a more powerful model and thinking budget.
 * @param topic The word or term to write an article about.
 * @param langCode The language code for the article.
 * @param isSensitive Whether the topic is on a sensitive subject.
 * @returns An async generator that yields text chunks of the article.
 */
export function streamDeeperArticle(
    topic: string,
    langCode: LanguageCode,
    isSensitive: boolean,
  ): AsyncGenerator<StreamResult, void, undefined> {
    const languageName = languageMap[langCode] || 'English';
    let prompt = `Perform a comprehensive analysis of the term: "${topic}". Synthesize information from multiple reliable web sources. Compare different perspectives or definitions if they exist. Provide a detailed, well-structured article that explains the topic thoroughly. The article must be written in ${languageName}. Be informative and neutral. Do not use markdown, titles, or any special formatting. Respond with only the text of the article itself.`;
    
    if (isSensitive) {
        prompt = `IMPORTANT: The user's query is on a sensitive topic related to potential harm. While providing a comprehensive, accurate, and neutral analysis, you MUST also include a concluding sentence or section that gently encourages users who might be struggling to seek help and provides universally recognized resources (like Befrienders Worldwide, crisis hotlines, or mental health support websites). ` + prompt;
    }

    return streamContent(prompt, topic, proModelName, {
      tools: [{googleSearch: {}}],
      thinkingConfig: { thinkingBudget: 4096 },
    });
}

/**
 * Checks a topic for sensitive content like self-harm or violence.
 * @param topic The topic to check.
 * @param langCode The language of the topic.
 * @param countryCode The user's two-letter country code (e.g., 'US', 'AU').
 * @returns A promise that resolves to an object indicating if the topic is sensitive and a corresponding warning message.
 */
export async function checkTopicSafety(topic: string, langCode: LanguageCode, countryCode: string | null): Promise<{ isSensitive: boolean; warningMessage: string; } | null> {
    if (!process.env.API_KEY) {
        console.error('Safety check skipped: API_KEY is not configured.');
        return null;
    }
    try {
        const languageName = languageMap[langCode] || 'English';
        const prompt = `Analyze the user's search query: "${topic}". Is this query related to self-harm, suicide, violence, or other topics where a user might be in distress? Respond in ${languageName}. Your response must be a JSON object with two properties: "isSensitive" (a boolean) and "warningMessage" (a string). If "isSensitive" is true, "warningMessage" must start with a supportive, empathetic message (e.g., "It sounds like you're going through a difficult time. Please reach out for support.") and then provide a relevant, prominent helpline for the user's country: "${countryCode || 'unknown'}". For 'US', provide the 988 lifeline. For 'GB', provide 111. For 'AU', provide Lifeline (13 11 14). If the user's country is unknown, provide a global resource like Befrienders Worldwide. If the topic is not sensitive, "isSensitive" should be false and "warningMessage" should be an empty string.`;

        const response = await ai.models.generateContent({
            model: flashModelName,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSensitive: { type: Type.BOOLEAN, description: 'Whether the topic is sensitive.' },
                        warningMessage: { type: Type.STRING, description: 'A helpful message if the topic is sensitive.' },
                    },
                    required: ['isSensitive', 'warningMessage'],
                },
            },
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        return result;

    } catch (error) {
        console.error(`Failed to perform safety check for "${topic}":`, error);
        return null; // Fail safe, don't block content
    }
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
            model: flashModelName, // Use the faster base model for this simple task
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
        
        const responseText = response.text;
        if (!responseText) {
            console.warn(`Synonym generation for "${topic}" returned no text content. This can occur if the model's response was empty or blocked by safety filters.`);
            return []; // Return an empty array as a safe fallback.
        }

        const jsonStr = responseText.trim();
        const result = JSON.parse(jsonStr);

        return result.synonyms || [];

    } catch (error) {
        console.error(`Failed to fetch synonyms for "${topic}":`, error);
        return null;
    }
}