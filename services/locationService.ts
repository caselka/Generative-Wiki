/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const GEOLOCATION_CACHE_KEY = 'geolocationData';

/**
 * Fetches geolocation data, caching the result in sessionStorage to minimize API calls.
 * @returns A promise that resolves to the location data object or an empty object on failure.
 */
export async function getGeolocationData(): Promise<Record<string, any>> {
    try {
        const cachedData = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    } catch (error) {
        console.warn("Could not read from sessionStorage:", error);
    }

    try {
        // NOTE: This uses a free key with usage limits. For production, replace with a robust, paid service.
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
            countryCode: data.country_code || null,
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
