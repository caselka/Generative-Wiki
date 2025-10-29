# Generative Wiki

> An encyclopedia where every word is a link. Click any word to dive deeper into an endless chain of knowledge, powered by Google's Gemini API.

[**Live Site → GenerativeWiki.com**](https://generativewiki.com)

Generative Wiki is an exploration of knowledge and creativity. Unlike a traditional encyclopedia, every word on this site is a hyperlink. Clicking on a word generates a new definition in real-time, creating an endless, interconnected web of information.

This project was created by [Caselka](https://github.com/caselka) as a way to visualize the vast, associative nature of generative AI and create a unique, interactive reading experience.

## ✨ Features

-   **Interactive Exploration**: Every word in a definition is clickable, generating a new definition on the fly.
-   **Real-time Generation**: Content is generated and streamed directly from the Gemini API for a responsive experience.
-   **Random Topic Discovery**: A "Random" button helps you discover new and interesting concepts from a curated list.
-   **Multilingual Support**: The interface and generated content can be switched between English, Spanish, French, German, and Japanese.
-   **Light & Dark Mode**: A comfortable viewing experience in any lighting condition.
-   **User Feedback**: An integrated system allows users to rate generations and provide qualitative feedback.
-   **Navigation History**: Easily track and revisit topics you've explored in your current session.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **AI Model**: Google Gemini API (`@google/genai`)
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
