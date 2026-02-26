/**
 * API utility functions for SahayakAI
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Check eligibility for PM Kisan scheme
 * @param {Object} userInputs - Form data
 * @param {string} language - 'en' or 'hi'
 * @returns {Promise<Object|null>} Eligibility result or null on error
 */
export async function checkEligibility(userInputs, language = 'en') {
  try {
    const response = await fetch(`${API_BASE_URL}/check-eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInputs,
        language
      })
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Network error in checkEligibility:', error);
    return null;
  }
}

/**
 * Get scheme data
 * @param {string} schemeId - Scheme identifier
 * @param {string} language - 'en' or 'hi'
 * @returns {Promise<Object|null>} Scheme data or null on error
 */
export async function getSchemeData(schemeId = 'pm-kisan', language = 'en') {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scheme-data?schemeId=${schemeId}&language=${language}`
    );

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Network error in getSchemeData:', error);
    return null;
  }
}
