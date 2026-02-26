/**
 * API Gateway Handler
 * 
 * Routes requests to appropriate Lambda functions:
 * - POST /check-eligibility -> eligibilityCheck + aiExplainer
 * - GET /scheme-data -> returns scheme overview
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { checkEligibility } from '../eligibilityCheck/index.js';
import { generateExplanation } from '../aiExplainer/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load PM Kisan rules
let pmKisanRules;
try {
  const rulesPath = join(__dirname, '../../data/pmkisan_rules.json');
  pmKisanRules = JSON.parse(readFileSync(rulesPath, 'utf8'));
} catch (error) {
  console.error('Failed to load PM Kisan rules:', error);
}

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Handle OPTIONS requests (CORS preflight)
 */
function handleOptions() {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: ''
  };
}

/**
 * Handle POST /check-eligibility
 * Orchestrates eligibilityCheck + aiExplainer
 */
async function handleCheckEligibility(body, language) {
  try {
    const { userInputs } = body;

    if (!userInputs) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Missing required field: userInputs'
        })
      };
    }

    // Step 1: Check eligibility (deterministic rules engine)
    const eligibilityResult = checkEligibility(userInputs, language);

    // Step 2: Generate AI explanation
    const explanation = await generateExplanation(eligibilityResult, language);

    // Step 3: Combine results
    const response = {
      ...eligibilityResult,
      explanation
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error in check-eligibility:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}

/**
 * Handle GET /scheme-data
 * Returns scheme overview from rules JSON
 */
function handleSchemeData(queryParams) {
  try {
    const schemeId = queryParams?.schemeId || 'pm-kisan';
    const language = queryParams?.language || 'en';

    if (schemeId !== 'pm-kisan') {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Scheme not found',
          message: 'Only pm-kisan is supported in this MVP'
        })
      };
    }

    // Build scheme overview
    const schemeData = {
      schemeId: pmKisanRules.schemeId,
      name: pmKisanRules.schemeName,
      description: language === 'hi' 
        ? 'किसान परिवारों के लिए आय सहायता योजना'
        : 'Income support scheme for farmer families',
      benefit: `₹${pmKisanRules.benefit.amount} per year in ${pmKisanRules.benefit.installments} installments`,
      benefitDetails: pmKisanRules.benefit,
      eligibilitySummary: language === 'hi'
        ? [
            'कृषि भूमि का मालिक होना चाहिए',
            'छोटे/सीमांत/सभी किसान श्रेणियां पात्र',
            'सरकारी कर्मचारी नहीं होना चाहिए',
            'आयकरदाता नहीं होना चाहिए'
          ]
        : [
            'Must own agricultural land',
            'Small/marginal/all farmer categories eligible',
            'Must not be a government employee',
            'Must not be an income tax payer'
          ],
      officialWebsite: 'https://pmkisan.gov.in',
      requiredDocuments: pmKisanRules.requiredDocuments
    };

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(schemeData)
    };
  } catch (error) {
    console.error('Error in scheme-data:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}

/**
 * Lambda handler - routes requests
 */
export async function handler(event) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Handle OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Parse request
  const path = event.path || event.rawPath || '';
  const method = event.httpMethod || event.requestContext?.http?.method || '';
  const queryParams = event.queryStringParameters || {};
  
  let body = {};
  if (event.body) {
    try {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'Invalid JSON in request body'
        })
      };
    }
  }

  const language = body.language || queryParams.language || 'en';

  // Route to appropriate handler
  if (method === 'POST' && path.includes('/check-eligibility')) {
    return await handleCheckEligibility(body, language);
  } else if (method === 'GET' && path.includes('/scheme-data')) {
    return handleSchemeData(queryParams);
  } else {
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Not found',
        message: `Route ${method} ${path} not found`
      })
    };
  }
}
