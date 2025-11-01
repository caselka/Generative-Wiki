# Generative Wiki

> An encyclopedia where every word is a link. Click any word to dive deeper into an endless chain of knowledge, powered by Google's Gemini API.

[**Live Site → GenerativeWiki.com**](https://generativewiki.com)

---

## ✨ Features

Generative Wiki is an experimental encyclopedia designed for fluid, associative, and serendipitous learning.

-   **Endless Exploration**: The core concept of the wiki. Every word on every page is a clickable hyperlink that generates a new definition in real-time, creating an endless web of knowledge.
-   **Multi-Word Search**: Go beyond single words. Click and drag to highlight any phrase to instantly search for it via a popup.
-   **Deep Dive Content**: After getting a concise initial definition, use the **Search Deeper** button to get a comprehensive, well-structured article synthesized from multiple web sources using a more powerful AI model.
-   **Complete Discovery Toolkit**: Start your journey with a powerful **Search bar** for any topic or use the **Random** button for serendipitous discovery from a large, curated list of interesting terms.
-   **Session History**: Easily track your exploration path. The **History** list lets you see every topic you've visited and jump back to any of them instantly.
-   **Global Reach**: The interface and generated content are available in multiple languages, including English, Spanish, French, German, Japanese, Mandarin Chinese, and Arabic, with full right-to-left (RTL) support.
-   **User-Focused UI/UX**:
    -   **Light & Dark Modes**: Choose your preferred reading mode. The app respects your system settings and offers a manual toggle.
    -   **Responsive Design**: A clean, readable interface that works seamlessly on desktop and mobile devices.
    -   **Performance**: Initial definitions are streamed from a highly optimized model (`gemini-flash-lite-latest`) for near-instant loading.
-   **Curation & Feedback**: Help improve the wiki by rating each generation with a thumbs-up or down. Optional text feedback is collected to enhance content quality.
-   **Comprehensive Documentation**: A full **Docs** page explains all features, the technology behind the project, and includes a detailed changelog.

## 📣 Latest Update: Version 1.3.1 (November 1, 2025)

This release focuses on enhancing the core user experience by improving the quality and reliability of generated content, strengthening user safety protocols, and fixing critical bugs.

### Key Features & Enhancements

*   **Improved Accuracy:** Enhanced the AI's reasoning for uncommon topics by allocating a 'thinking budget' for the initial search, providing more accurate definitions without requiring a 'Search Deeper' action.
*   **Proactive User Safety:** Implemented a new safety system that detects sensitive topics, displays a prominent warning with localized support hotlines (based on user's region), and instructs the AI to include helpful resources in its responses.
*   **Enhanced Loading Experience:** Replaced static loading bars with a subtle, pulsing animation for better visual feedback during content generation.

### Bug Fixes & Stability

*   **Robust Logging:** Fixed a critical bug where content generation time was not being logged correctly. Implemented a robust, multi-layered fix:
    *   **Client-Side Timer:** Generation time is now accurately measured using `performance.now()`.
    *   **Client-Side Hardening:** The logging service now validates `generationTime` to ensure it's a non-negative integer, sending `null` for invalid values to prevent server errors.
    *   **Server-Side Guard:** The Google Apps Script now defensively handles `generationTime`, ensuring it can process numbers, number-like strings, or `null` without failing.
    *   **CORS Fix:** Resolved a network issue by reverting the `Content-Type` header on logging requests to `text/plain`, preventing CORS preflight failures with the Apps Script backend.
*   **Math Rendering Fix:** Resolved an application-breaking error with the `react-katex` library, ensuring content with mathematical formulas (LaTeX) loads correctly.
*   **Synonym Generation Fix:** Resolved an application crash that occurred when the synonym generation API returned an empty or blocked response. The app now gracefully handles these cases.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **AI Model**: Google Gemini API (`@google/genai`), using `gemini-flash-lite-latest` for speed and `gemini-2.5-pro` for deep searches.
-   **Styling**: Plain CSS with CSS Variables for easy theming.
-   **Dependencies**: Served via ESM (`esm.sh`) for a build-less development experience.

## 🚀 Getting Started

This is a client-side only application designed to run in an environment where the Google Gemini API key is securely provided.

### Prerequisites

-   A modern web browser.
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   A local development environment that can serve static files and provide the `process.env.API_KEY` variable to the browser.

### Running the App

1.  **Provide API Key:** Ensure the `API_KEY` environment variable is set in your deployment or development environment. The application reads the key from `process.env.API_KEY`.

2.  **Serve the files:** Use any simple static file server from the project's root directory.
    ```bash
    # Example using Python 3's built-in server
    python -m http.server

    # Example using Node.js and the 'serve' package
    npm install -g serve
    serve .
    ```

3.  Open your browser and navigate to the local server's address (e.g., `http://localhost:8000`).

## 📊 Feedback System

The application includes a feedback mechanism that allows users to rate generated content. The feedback is submitted to a Google Apps Script connected to a Google Sheet.

To set up your own feedback backend:

1.  Create a new Google Sheet.
2.  Go to `Extensions > Apps Script`.
3.  Paste the code from the comments in `services/feedbackService.ts` into the script editor.
4.  Deploy the script as a Web App, granting access to "Anyone".
5.  Copy the deployment URL and paste it into the `SCRIPT_URL` constant in `services/feedbackService.ts`.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue to discuss a new feature or submit a pull request with improvements.

## 📄 License

This project is licensed under the Apache License 2.0. See the license headers in the source files for more details.