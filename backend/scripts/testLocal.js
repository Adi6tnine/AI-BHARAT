/**
 * Local Test Script for Eligibility Logic
 * 
 * Tests the pure eligibility logic without AWS credentials
 * Run: node scripts/testLocal.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load PM Kisan rules
const rulesPath = join(__dirname, '../data/pmkisan_rules.json');
const pmKisanRules = JSON.parse(readFileSync(rulesPath, 'utf8'));

/**
 * Pure eligibility check logic (copied from eligibilityCheck function)
 */
function checkEligibility(userInputs, language = 'en') {
  const { 
    hasLand, 
    landSizeHectares, 
    farmerCategory,
    isGovtEmployee,
    isTaxPayer,
    isInstitutionalHolder
  } = userInputs;

  // Step 1: Check exclusion criteria first
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

  // Step 2: Check land ownership
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
 * Test cases
 */
const testCases = [
  {
    name: 'Test 1: Small farmer, 1.5 hectares',
    input: {
      hasLand: true,
      landSizeHectares: 1.5,
      farmerCategory: 'small',
      isGovtEmployee: false,
      isTaxPayer: false,
      isInstitutionalHolder: false
    },
    expectedEligible: true,
    expectedReasonCode: 'ELIGIBLE_SMALL_FARMER'
  },
  {
    name: 'Test 2: Government employee',
    input: {
      hasLand: true,
      landSizeHectares: 1.0,
      farmerCategory: 'small',
      isGovtEmployee: true,
      isTaxPayer: false,
      isInstitutionalHolder: false
    },
    expectedEligible: false,
    expectedReasonCode: 'GOVT_EMPLOYEE_EXCLUSION'
  },
  {
    name: 'Test 3: No land ownership',
    input: {
      hasLand: false,
      landSizeHectares: 0,
      farmerCategory: 'small',
      isGovtEmployee: false,
      isTaxPayer: false,
      isInstitutionalHolder: false
    },
    expectedEligible: false,
    expectedReasonCode: 'NO_LAND_OWNERSHIP'
  },
  {
    name: 'Test 4: Marginal farmer, 0.8 hectares',
    input: {
      hasLand: true,
      landSizeHectares: 0.8,
      farmerCategory: 'marginal',
      isGovtEmployee: false,
      isTaxPayer: false,
      isInstitutionalHolder: false
    },
    expectedEligible: true,
    expectedReasonCode: 'ELIGIBLE_MARGINAL_FARMER'
  },
  {
    name: 'Test 5: Income tax payer',
    input: {
      hasLand: true,
      landSizeHectares: 1.0,
      farmerCategory: 'small',
      isGovtEmployee: false,
      isTaxPayer: true,
      isInstitutionalHolder: false
    },
    expectedEligible: false,
    expectedReasonCode: 'INCOME_TAX_EXCLUSION'
  }
];

/**
 * Run tests
 */
console.log('═══════════════════════════════════════════════════════');
console.log('  SahayakAI - Local Eligibility Logic Tests');
console.log('═══════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`${testCase.name}`);
  console.log('─'.repeat(60));
  
  const result = checkEligibility(testCase.input, 'en');
  
  const eligibleMatch = result.eligible === testCase.expectedEligible;
  const reasonCodeMatch = result.reasonCode === testCase.expectedReasonCode;
  
  const passed = eligibleMatch && reasonCodeMatch;
  
  if (passed) {
    console.log('✅ PASS');
    passCount++;
  } else {
    console.log('❌ FAIL');
    failCount++;
  }
  
  console.log(`   Expected: eligible=${testCase.expectedEligible}, reasonCode=${testCase.expectedReasonCode}`);
  console.log(`   Got:      eligible=${result.eligible}, reasonCode=${result.reasonCode}`);
  
  if (!passed) {
    console.log(`   Reason: ${result.reasonMessage}`);
  }
  
  console.log('');
});

console.log('═══════════════════════════════════════════════════════');
console.log(`  Results: ${passCount} PASSED, ${failCount} FAILED`);
console.log('═══════════════════════════════════════════════════════\n');

if (failCount > 0) {
  console.log('❌ Some tests failed. Please review the logic.');
  process.exit(1);
} else {
  console.log('✅ All tests passed! Ready to deploy.');
  process.exit(0);
}
