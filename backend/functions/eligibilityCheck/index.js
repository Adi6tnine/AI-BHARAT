/**
 * PM Kisan Eligibility Check Lambda Function
 * 
 * CRITICAL: This function makes ALL eligibility decisions
 * - Pure deterministic logic only
 * - No AI, no Bedrock, no external API calls
 * - Returns reason codes that AI will later explain
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load PM Kisan rules
let pmKisanRules;
try {
  const rulesPath = join(__dirname, '../../data/pmkisan_rules.json');
  pmKisanRules = JSON.parse(readFileSync(rulesPath, 'utf8'));
} catch (error) {
  console.error('Failed to load PM Kisan rules:', error);
  throw new Error('Rules configuration not available');
}

/**
 * Check eligibility for PM Kisan scheme
 * 
 * @param {Object} userInputs - User form data
 * @param {boolean} userInputs.hasLand - Owns agricultural land
 * @param {number} userInputs.landSizeHectares - Land size in hectares
 * @param {string} userInputs.farmerCategory - small/marginal/all
 * @param {boolean} userInputs.isGovtEmployee - Government employee status
 * @param {boolean} userInputs.isTaxPayer - Income tax payer status
 * @param {boolean} userInputs.isInstitutionalHolder - Institutional holder status
 * @param {string} language - en or hi
 * @returns {Object} Eligibility result
 */
export function checkEligibility(userInputs, language = 'en') {
  const { 
    hasLand, 
    landSizeHectares, 
    farmerCategory,
    isGovtEmployee,
    isTaxPayer,
    isInstitutionalHolder
  } = userInputs;

  // Step 1: Check exclusion criteria first (any match = immediately ineligible)
  for (const exclusion of pmKisanRules.exclusionCriteria) {
    const userValue = userInputs[exclusion.field];
    
    if (userValue === exclusion.value) {
      return {
        eligible: false,
        reasonCode: exclusion.code,
        reasonMessage: language === 'hi' ? exclusion.message_hi : exclusion.message_en,
        requiredDocuments: [],
        alternativeSchemes: pmKisanRules.alternativeSchemes,
        userInputs
      };
    }
  }

  // Step 2: Check land ownership (already covered in exclusion, but explicit check)
  if (!hasLand) {
    const exclusion = pmKisanRules.exclusionCriteria.find(e => e.code === 'NO_LAND_OWNERSHIP');
    return {
      eligible: false,
      reasonCode: 'NO_LAND_OWNERSHIP',
      reasonMessage: language === 'hi' ? exclusion.message_hi : exclusion.message_en,
      requiredDocuments: [],
      alternativeSchemes: pmKisanRules.alternativeSchemes,
      userInputs
    };
  }

  // Step 3: Check land size against category limits
  const landLimits = pmKisanRules.landLimits;
  const eligibilityCodes = pmKisanRules.eligibilityCodes;

  // Validate land size is positive
  if (landSizeHectares <= 0) {
    return {
      eligible: false,
      reasonCode: 'INVALID_LAND_SIZE',
      reasonMessage: language === 'hi' 
        ? 'भूमि का आकार मान्य नहीं है। कृपया सही जानकारी दें।'
        : 'Invalid land size. Please provide correct information.',
      requiredDocuments: [],
      alternativeSchemes: pmKisanRules.alternativeSchemes,
      userInputs
    };
  }

  // Check eligibility based on farmer category
  let eligible = false;
  let reasonCode = '';
  let reasonMessage = '';

  if (farmerCategory === 'marginal') {
    if (landSizeHectares <= landLimits.marginal) {
      eligible = true;
      reasonCode = 'ELIGIBLE_MARGINAL_FARMER';
      reasonMessage = language === 'hi' 
        ? eligibilityCodes.ELIGIBLE_MARGINAL_FARMER.message_hi
        : eligibilityCodes.ELIGIBLE_MARGINAL_FARMER.message_en;
    } else {
      eligible = false;
      reasonCode = 'LAND_SIZE_EXCEEDS_LIMIT';
      reasonMessage = language === 'hi'
        ? eligibilityCodes.LAND_SIZE_EXCEEDS_LIMIT.message_hi
        : eligibilityCodes.LAND_SIZE_EXCEEDS_LIMIT.message_en;
    }
  } else if (farmerCategory === 'small') {
    if (landSizeHectares <= landLimits.small) {
      eligible = true;
      reasonCode = 'ELIGIBLE_SMALL_FARMER';
      reasonMessage = language === 'hi'
        ? eligibilityCodes.ELIGIBLE_SMALL_FARMER.message_hi
        : eligibilityCodes.ELIGIBLE_SMALL_FARMER.message_en;
    } else {
      eligible = false;
      reasonCode = 'LAND_SIZE_EXCEEDS_LIMIT';
      reasonMessage = language === 'hi'
        ? eligibilityCodes.LAND_SIZE_EXCEEDS_LIMIT.message_hi
        : eligibilityCodes.LAND_SIZE_EXCEEDS_LIMIT.message_en;
    }
  } else if (farmerCategory === 'all') {
    // Post-2019 amendment: all landowning farmers eligible regardless of size
    if (landSizeHectares <= landLimits.all) {
      eligible = true;
      reasonCode = 'ELIGIBLE_ALL_FARMERS';
      reasonMessage = language === 'hi'
        ? 'आप PM किसान योजना के लिए पात्र हैं। 2019 के संशोधन के बाद सभी भूमिधारक किसान पात्र हैं।'
        : 'You are eligible for PM Kisan. After 2019 amendment, all landowning farmers are eligible.';
    } else {
      eligible = false;
      reasonCode = 'LAND_SIZE_EXCEEDS_LIMIT';
      reasonMessage = language === 'hi'
        ? 'आपकी भूमि का आकार असामान्य रूप से बड़ा है। कृपया सही जानकारी सत्यापित करें।'
        : 'Your land size is unusually large. Please verify correct information.';
    }
  } else {
    // Invalid category
    return {
      eligible: false,
      reasonCode: 'INVALID_CATEGORY',
      reasonMessage: language === 'hi'
        ? 'अमान्य किसान श्रेणी। कृपया सही श्रेणी चुनें।'
        : 'Invalid farmer category. Please select correct category.',
      requiredDocuments: [],
      alternativeSchemes: pmKisanRules.alternativeSchemes,
      userInputs
    };
  }

  // Step 4: Return decision with appropriate data
  return {
    eligible,
    reasonCode,
    reasonMessage,
    requiredDocuments: eligible ? pmKisanRules.requiredDocuments : [],
    alternativeSchemes: eligible ? [] : pmKisanRules.alternativeSchemes,
    userInputs
  };
}

/**
 * Lambda handler
 */
export async function handler(event) {
  try {
    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { userInputs, language = 'en' } = body;

    // Validate required fields
    if (!userInputs) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Missing required field: userInputs'
        })
      };
    }

    // Check eligibility
    const result = checkEligibility(userInputs, language);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error in eligibility check:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}
