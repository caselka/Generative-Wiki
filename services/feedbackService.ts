/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// README: How to set up your feedback database with Google Sheets.
// 1. Create a new Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the following code into the script editor and save it:
/*
function doPost(e) {
  try {
    // Best practice: Lock the script to prevent concurrent modifications
    var lock = LockService.getScriptLock();
    lock.waitLock(30000); // Wait up to 30 seconds

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Topic", "Rating", "Reason", "Output"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Basic validation
    if (!data.topic || !data.rating) {
      return ContentService
        .createTextOutput(JSON.stringify({ "status": "error", "message": "Missing required fields." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var timestamp = new Date();
    sheet.appendRow([timestamp, data.topic, data.rating, data.reason || '', data.output || '']);
    
    lock.releaseLock(); // Release the lock
    
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Make sure to release the lock in case of an error
    if (lock) {
      lock.releaseLock();
    }
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
// 4. Click Deploy > New deployment.
// 5. Select "Web app" for the configuration type.
// 6. For "Execute as," select "Me".
// 7. For "Who has access," select "Anyone". This is required for anonymous feedback.
// 8. Click Deploy. Authorize the script when prompted.
// 9. Copy the Web app URL and paste it into the SCRIPT_URL variable below.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLDzlDy_uKUnvOGIXKCsV3KYKnq3tSPfuKPJbUQV_8oCX7cPMwG4bcftCX7X6txMQ/exec';

// Client-side rate limiting to prevent abuse.
// This is not foolproof but helps prevent accidental spamming.
const MAX_SUBMISSIONS_PER_HOUR = 5;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const FEEDBACK_STORAGE_KEY = 'feedbackSubmissions';

interface FeedbackData {
    topic: string;
    rating: 'up' | 'down';
    reason: string;
    output: string;
}

/**
 * Checks if the user has submitted feedback too frequently and records the new submission.
 * Throws an error if the rate limit is exceeded.
 */
function checkAndRecordSubmission() {
    try {
        const now = Date.now();
        const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
        let timestamps: number[] = stored ? JSON.parse(stored) : [];

        // Keep only timestamps from the last hour
        timestamps = timestamps.filter(ts => (now - ts) < ONE_HOUR_IN_MS);

        if (timestamps.length >= MAX_SUBMISSIONS_PER_HOUR) {
            throw new Error(`Rate limit exceeded. Please try again later. You can submit feedback ${MAX_SUBMISSIONS_PER_HOUR} times per hour.`);
        }

        // Record new submission
        timestamps.push(now);
        localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(timestamps));
    } catch (error) {
        // This can happen if localStorage is disabled, full, or if the stored data is corrupt.
        // This is a "best-effort" client-side limit, so we will log the error and allow the submission to proceed.
        console.warn('Could not enforce feedback rate limit:', error);
    }
}


/**
 * Submits feedback data to a configured Google Apps Script endpoint.
 * @param data The feedback data to submit.
 */
export async function submitFeedback(data: FeedbackData): Promise<void> {
    checkAndRecordSubmission(); // Throws an error if rate limit is hit, which is caught by the component.

    if (!SCRIPT_URL) {
        console.log('Feedback submission skipped: SCRIPT_URL is not configured.');
        console.log('Simulated feedback data:', data);
        // Simulate a network delay for UI testing purposes
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
    }

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            // Google Apps Script web apps require a workaround for CORS.
            // Sending as text/plain and letting the script parse it is a common method.
            // mode: 'no-cors' can also work but prevents reading the response.
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify(data),
        });
        // We don't need to process the response, just ensure the request is sent.
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        // Re-throw the error so the calling component can handle the UI state
        throw error;
    }
}