/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// README: How to Set Up Your Feedback & Logging Database
//
// This Google Apps Script creates and manages TWO separate sheets in your Google Sheet document:
// 1. 'Feedback': Captures all user-submitted ratings (👍/👎), optional text feedback,
//    the generated content that was rated, whether "Deep Search" was used, and the user's location data.
// 2. 'Search Logs': Captures every search query and "Deep Search" action, along with a timestamp and approximate location.
//
// STEPS:
// 1. Create a new Google Sheet.
// 2. Go to Extensions > Apps Script.
// 3. Paste the following code into the script editor and save it.
/*
function doPost(e) {
  // This check prevents errors when the script is run manually from the editor.
  if (!e || !e.postData || !e.postData.contents) {
    var manualRunMessage = "This function is designed to be triggered by a POST request from the web app. If you are running it manually for testing, this message is expected.";
    console.log(manualRunMessage);
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "info", "message": manualRunMessage }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30 seconds

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();
    var loc = data.location || {};

    if (data.type === 'search' || data.type === 'deep_search') {
      var searchSheetName = 'Search Logs';
      var sheet = ss.getSheetByName(searchSheetName);
      var expectedHeaders = ["Timestamp", "Topic", "Deep Search Used", "IP Address", "Country", "Region", "City", "Latitude", "Longitude", "ISP", "Organization"];
      var needsMigration = false;
      
      if (!sheet) {
        sheet = ss.insertSheet(searchSheetName);
        sheet.appendRow(expectedHeaders);
      } else if (sheet.getLastRow() > 0) {
        var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (currentHeaders.length < 3 || currentHeaders[2] !== 'Deep Search Used') {
          needsMigration = true;
        }
      } else { // Sheet is empty
        sheet.clear();
        sheet.appendRow(expectedHeaders);
      }

      if (needsMigration) {
          var oldSheetName = searchSheetName + '_old_' + new Date().toISOString().slice(0, 10).replace(/-/g,"");
          var i = 1;
          while (ss.getSheetByName(oldSheetName)) {
              oldSheetName = searchSheetName + '_old_' + new Date().toISOString().slice(0, 10).replace(/-/g,"") + '_' + i;
              i++;
          }
          sheet.setName(oldSheetName);
          
          sheet = ss.insertSheet(searchSheetName, 0);
          sheet.appendRow(expectedHeaders);
      }

      var deepSearchUsed = data.type === 'deep_search' ? 'Yes' : 'No';

      sheet.appendRow([
        timestamp,
        data.topic,
        deepSearchUsed,
        loc.ip || 'N/A',
        loc.country || 'N/A',
        loc.regionName || 'N/A',
        loc.city || 'N/A',
        loc.lat || 'N/A',
        loc.lon || 'N/A',
        loc.isp || 'N/A',
        loc.org || 'N/A'
      ]);

    } else { // Handle feedback (default)
      var feedbackSheetName = 'Feedback';
      var sheet = ss.getSheetByName(feedbackSheetName);
      var expectedFeedbackHeaders = ["Timestamp", "Topic", "Rating", "Reason", "Initial Definition", "Deep Search Used", "Expanded Article", "IP Address", "Country", "Region", "City", "Latitude", "Longitude", "ISP", "Organization"];
      var needsFeedbackMigration = false;

      if (!sheet) {
        sheet = ss.insertSheet(feedbackSheetName, 0);
        sheet.appendRow(expectedFeedbackHeaders);
      } else if (sheet.getLastRow() > 0) {
        var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        if (currentHeaders.length < 8 || currentHeaders[7] !== "IP Address") {
           needsFeedbackMigration = true;
        }
      } else {
        sheet.appendRow(expectedFeedbackHeaders);
      }
      
      if (needsFeedbackMigration) {
        var oldSheetName = feedbackSheetName + '_old_' + new Date().toISOString().slice(0, 10).replace(/-/g,"");
        var i = 1;
        while (ss.getSheetByName(oldSheetName)) {
            oldSheetName = feedbackSheetName + '_old_' + new Date().toISOString().slice(0, 10).replace(/-/g,"") + '_' + i;
            i++;
        }
        sheet.setName(oldSheetName);
        sheet = ss.insertSheet(feedbackSheetName, 0);
        sheet.appendRow(expectedFeedbackHeaders);
      }
      
      if (!data.topic || !data.rating) {
        throw new Error("Missing required feedback fields: topic and rating.");
      }
      var deepSearchUsed = data.wasDeepSearchUsed ? 'Yes' : 'No';
      
      sheet.appendRow([
          timestamp, 
          data.topic, 
          data.rating, 
          data.reason || '', 
          data.definition || '',
          deepSearchUsed,
          data.expandedArticle || '',
          loc.ip || 'N/A',
          loc.country || 'N/A',
          loc.regionName || 'N/A',
          loc.city || 'N/A',
          loc.lat || 'N/A',
          loc.lon || 'N/A',
          loc.isp || 'N/A',
          loc.org || 'N/A'
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error(error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lock && lock.hasLock()) {
      lock.releaseLock();
    }
  }
}
*/
// 4. Click Deploy > New deployment.
// 5. Select "Web app" for the configuration type.
// 6. For "Execute as," select "Me".
// 7. For "Who has access," select "Anyone". This is required for anonymous submissions.
// 8. Click Deploy. Authorize the script when prompted.
// 9. Copy the Web app URL and paste it into the SCRIPT_URL variable below.

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzPxU4kU9ReakOVbcCVfpC968bF3Jn_N6TnyTpJfSBNv_n_mEepXdIaVJ5XKlKVZETj/exec';

// --- Client-side rate limiting to prevent abuse ---
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const MAX_FEEDBACK_SUBMISSIONS_PER_HOUR = 5;
const FEEDBACK_STORAGE_KEY = 'feedbackSubmissions';

const MAX_SEARCH_LOGS_PER_HOUR = 100;
const SEARCH_LOG_STORAGE_KEY = 'searchLogSubmissions';

const GEOLOCATION_CACHE_KEY = 'geolocationData';

interface FeedbackData {
    topic: string;
    rating: 'up' | 'down';
    reason: string;
    definition: string;
    expandedArticle: string;
    wasDeepSearchUsed: boolean;
}

/**
 * A generic rate-limiting utility function.
 * Throws an error if the rate limit is exceeded for the given key.
 */
function checkAndRecord(storageKey: string, maxPerHour: number, limitName: string) {
    try {
        const now = Date.now();
        const stored = localStorage.getItem(storageKey);
        let timestamps: number[] = stored ? JSON.parse(stored) : [];

        // Keep only timestamps from the last hour
        timestamps = timestamps.filter(ts => (now - ts) < ONE_HOUR_IN_MS);

        if (timestamps.length >= maxPerHour) {
            throw new Error(`Rate limit for ${limitName} exceeded. Please try again later. You can submit ${maxPerHour} times per hour.`);
        }

        // Record new submission
        timestamps.push(now);
        localStorage.setItem(storageKey, JSON.stringify(timestamps));
    } catch (error) {
        if (error instanceof Error && error.message.startsWith('Rate limit')) {
            throw error;
        }
        // This can happen if localStorage is disabled or full. This is a "best-effort" client-side limit,
        // so we will log the error and allow the submission to proceed in these edge cases.
        console.warn(`Could not enforce ${limitName} rate limit:`, error);
    }
}


/**
 * Submits feedback data to a configured Google Apps Script endpoint.
 * @param data The feedback data to submit.
 */
export async function submitFeedback(data: FeedbackData): Promise<void> {
    checkAndRecord(FEEDBACK_STORAGE_KEY, MAX_FEEDBACK_SUBMISSIONS_PER_HOUR, 'feedback'); 
    
    const locationData = await getGeolocationData();
    const payload = { ...data, location: locationData };

    if (!SCRIPT_URL) {
        console.log('Feedback submission skipped: SCRIPT_URL is not configured.');
        console.log('Simulated feedback data:', payload);
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
    }

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload), // The script defaults to handling feedback
        });
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        throw error;
    }
}

/**
 * Fetches geolocation data, caching the result in sessionStorage to minimize API calls.
 * @returns A promise that resolves to the location data object or an empty object on failure.
 */
async function getGeolocationData(): Promise<Record<string, any>> {
    try {
        const cachedData = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (error) {
        console.warn("Could not read from sessionStorage:", error);
    }

    try {
        const response = await fetch('https://ipapi.co/json/?key=EOh0COlyp0yo5giaRQ1dX9lJRWC6ZdV4DfV2a55DiH539UVNDe');
        if (!response.ok) {
            console.warn(`Geolocation API responded with status: ${response.status}`);
            return {};
        }

        const data = await response.json();
        if (data.error) {
            console.warn(`Geolocation API returned an error: ${data.reason}`);
            // Don't cache error responses as they may be temporary (e.g. rate limit)
            return {};
        }

        const locationData = {
            ip: data.ip || 'N/A',
            country: data.country_name || 'N/A',
            regionName: data.region || 'N/A',
            city: data.city || 'N/A',
            lat: data.latitude || 'N/A',
            lon: data.longitude || 'N/A',
            isp: data.org || 'N/A',
            org: data.org || 'N/A',
        };

        try {
            sessionStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify(locationData));
        } catch (error) {
            console.warn("Could not write to sessionStorage:", error);
        }
        
        return locationData;

    } catch (error) {
        console.warn("Could not fetch geolocation data:", error);
        return {};
    }
}

/**
 * Logs a generic search-related event. This is a fire-and-forget function.
 * @param type The type of event ('search' or 'deep_search').
 * @param topic The search term associated with the event.
 */
async function logGenericSearchEvent(type: 'search' | 'deep_search', topic: string): Promise<void> {
    try {
        checkAndRecord(SEARCH_LOG_STORAGE_KEY, MAX_SEARCH_LOGS_PER_HOUR, 'search logs');
    } catch (e) {
        console.warn("Search log rate limit exceeded. Skipping log.");
        return; // Silently exit if rate limited
    }

    const locationData = await getGeolocationData();
    
    const payload = {
        type: type,
        topic: topic,
        location: locationData,
    };

    if (!SCRIPT_URL) {
        console.log(`Search logging skipped (${type}): SCRIPT_URL is not configured.`);
        console.log('Simulated search log data:', payload);
        return;
    }
    
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        // This is a background task, so we just log the error instead of re-throwing it.
        console.error('Failed to submit search log:', error);
    }
}


/**
 * Logs a standard search query.
 * @param topic The search term that was used.
 */
export async function logSearch(topic: string): Promise<void> {
    await logGenericSearchEvent('search', topic);
}

/**
 * Logs when a "Deep Search" action is performed on a topic.
 * @param topic The topic that was searched deeper.
 */
export async function logDeepSearch(topic: string): Promise<void> {
    await logGenericSearchEvent('deep_search', topic);
}