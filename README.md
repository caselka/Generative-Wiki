# Generative Wiki - Build Log: Week 1

> An encyclopedia where every word is a link. Click any word to dive deeper into an endless chain of knowledge, powered by Google's Gemini API.

[**Live Site → GenerativeWiki.com**](https://generativewiki.com)

---

Week 1 is a wrap and we're officially live! It's been a busy first week laying the foundation and shipping the core experience for Generative Wiki. Our goal was to go from zero to a fully functional, interactive encyclopedia, and we're thrilled with the result.

## ✨ What We Shipped in Week 1

Our focus was on building a polished, feature-complete v1. Here’s a rundown of everything that went live:

-   **The "Endless Wiki" Engine**: The core concept is alive and kicking. Every word in a generated definition is a clickable link, powered by real-time streaming from the Gemini API. This creates a fluid, uninterrupted exploration experience.
-   **Discovery Tools**: To kickstart your journey, we added a powerful **Search bar** and a **Random** button. The random button pulls from a large, curated list of interesting, funny, and thought-provoking terms.
-   **Session History**: It's easy to get lost in the wiki rabbit hole, so we built a session **History** list. You can easily see the path you've taken and jump back to any previous topic.
-   **Full Internationalization (i18n)**: From day one, we wanted this to be a global tool. The app is fully translated and generates content in English, Spanish, French, German, and Japanese.
-   **Light & Dark Modes**: We added a theme toggle that respects your system preference but also lets you switch between light and dark modes for comfortable reading.
-   **Robust Feedback Loop**: We set up a simple but effective curation system. Users can give a thumbs-up/down to any generation and provide optional text feedback, which is piped directly into a Google Sheet via Apps Script for easy analysis.
-   **Core Static Pages**: We rounded out the user experience with an **About** page to explain the project and a **Donate** page to help support its operational costs.

## 🚀 What's Next for Week 2?

With the foundation in place, we'll be focusing on refinement and new features. We're thinking about UI/UX improvements, exploring different content formats, and potentially adding ways for users to share their discovery paths. Stay tuned!

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
