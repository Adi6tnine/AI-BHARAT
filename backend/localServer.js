/**
 * Local Mock Server for SahayakAI
 * 
 * Mimics AWS Lambda functions locally without requiring AWS services
 * Run: npm run local
 */

import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load PM Kisan rules
let pmKisanRules;
try {
  const rulesPath = join(__dirname, 'data/pmkisan_rules.json');
  pmKisanRules = JSON.parse(readFileSync(rulesPath, 'utf8'));
  console.log('✅ Loaded PM Kisan rules');
} catch (error) {
  console.error('❌ Failed to load PM Kisan rules:', error);
  process.exit(1);
}

/**
 * Mock AI Explanation Generator
 * Returns realistic explanations based on eligibility result
 */
function generateMockExplanation(eligibilityResult, language) {
  const { eligible, reasonCode, userInputs } = eligibilityResult;
  
  // English explanations
  const explanations_en = {
    // Eligible scenarios
    ELIGIBLE_SMALL_FARMER: `Based on your profile, you qualify for PM Kisan Samman Nidhi! As a small farmer with ${userInputs.landSizeHectares} hectares of land, you meet all the required criteria. You will receive ₹6,000 per year in 3 installments of ₹2,000 each, directly deposited into your bank account. Next steps: (1) Link your Aadhaar to your bank account, (2) Gather your land records (Khata/Khatauni), and (3) Register on the PM Kisan portal at pmkisan.gov.in.`,
    
    ELIGIBLE_MARGINAL_FARMER: `Great news! You are eligible for PM Kisan Samman Nidhi as a marginal farmer with ${userInputs.landSizeHectares} hectares of land. This scheme will provide you with ₹6,000 annually in three equal installments. The money will be transferred directly to your bank account through Direct Benefit Transfer (DBT). Make sure your Aadhaar is linked to your bank account and keep your land records ready for registration.`,
    
    ELIGIBLE_ALL_FARMERS: `You qualify for PM Kisan Samman Nidhi! After the 2019 amendment, all landowning farmers are eligible regardless of land size. With ${userInputs.landSizeHectares} hectares of agricultural land, you can receive ₹6,000 per year in three installments. To apply, ensure your documents are in order: Aadhaar card, land ownership records, and an active bank account linked to Aadhaar.`,
    
    // Ineligible scenarios
    GOVT_EMPLOYEE_EXCLUSION: `Unfortunately, you do not qualify for PM Kisan at this time. Since you or your spouse is a government employee, this scheme is not available to your family. Government employees and their families are excluded from PM Kisan benefits. However, you may be eligible for other schemes like MGNREGS (100 days of guaranteed employment) or PM Fasal Bima Yojana (crop insurance). Visit the respective websites to learn more about these alternatives.`,
    
    INCOME_TAX_EXCLUSION: `You are not eligible for PM Kisan Samman Nidhi because you or your spouse paid income tax in the last assessment year. Income tax payers are excluded from this scheme as it is designed to support small and marginal farmers with limited income. Consider exploring PM Fasal Bima Yojana for crop insurance coverage, which is available to all farmers regardless of income tax status.`,
    
    NO_LAND_OWNERSHIP: `PM Kisan requires you to own agricultural land. Since you do not own land, you are not eligible for this scheme. However, as a landless agricultural laborer, you may qualify for MGNREGS (Mahatma Gandhi National Rural Employment Guarantee Scheme), which guarantees 100 days of wage employment per year to rural households. Visit nrega.nic.in to learn more and apply.`,
    
    INSTITUTIONAL_HOLDER: `Land owned by institutions such as companies, trusts, schools, or other organizations is not eligible for PM Kisan. This scheme is exclusively for individual farmer families. If you are an individual farmer working on institutional land, you may want to explore other employment or support schemes like MGNREGS.`,
    
    LAND_SIZE_EXCEEDS_LIMIT: `Your land holding of ${userInputs.landSizeHectares} hectares exceeds the limit for the ${userInputs.farmerCategory} farmer category. While you may not qualify under this category, you might be eligible under the "all farmers" category if you reapply. Alternatively, consider PM Fasal Bima Yojana for crop insurance, which is available to all farmers regardless of land size.`,
    
    INVALID_LAND_SIZE: `The land size you provided appears to be invalid. Please verify your land records and ensure you enter the correct land area in hectares. You can find this information in your Khata, Khatauni, or other official land documents from your local revenue office.`,
    
    INVALID_CATEGORY: `The farmer category you selected is not valid. Please choose from: Marginal Farmer (up to 1 hectare), Small Farmer (up to 2 hectares), or Other/Not sure. Check your land records to determine the correct category based on your total land holding.`
  };
  
  // Hindi explanations
  const explanations_hi = {
    ELIGIBLE_SMALL_FARMER: `आपकी प्रोफ़ाइल के आधार पर, आप PM किसान सम्मान निधि के लिए पात्र हैं! ${userInputs.landSizeHectares} हेक्टेयर भूमि वाले छोटे किसान के रूप में, आप सभी आवश्यक मानदंडों को पूरा करते हैं। आपको प्रति वर्ष ₹6,000 की राशि 3 किस्तों में ₹2,000 प्रत्येक, सीधे आपके बैंक खाते में जमा की जाएगी। अगले कदम: (1) अपने आधार को बैंक खाते से लिंक करें, (2) अपने भूमि रिकॉर्ड (खाता/खतौनी) एकत्र करें, और (3) pmkisan.gov.in पर PM किसान पोर्टल पर पंजीकरण करें।`,
    
    ELIGIBLE_MARGINAL_FARMER: `बढ़िया खबर! आप ${userInputs.landSizeHectares} हेक्टेयर भूमि वाले सीमांत किसान के रूप में PM किसान सम्मान निधि के लिए पात्र हैं। यह योजना आपको तीन समान किस्तों में सालाना ₹6,000 प्रदान करेगी। पैसा सीधे लाभ हस्तांतरण (DBT) के माध्यम से सीधे आपके बैंक खाते में स्थानांतरित किया जाएगा। सुनिश्चित करें कि आपका आधार आपके बैंक खाते से लिंक है और पंजीकरण के लिए अपने भूमि रिकॉर्ड तैयार रखें।`,
    
    ELIGIBLE_ALL_FARMERS: `आप PM किसान सम्मान निधि के लिए पात्र हैं! 2019 के संशोधन के बाद, भूमि के आकार की परवाह किए बिना सभी भूमिधारक किसान पात्र हैं। ${userInputs.landSizeHectares} हेक्टेयर कृषि भूमि के साथ, आप तीन किस्तों में प्रति वर्ष ₹6,000 प्राप्त कर सकते हैं। आवेदन करने के लिए, सुनिश्चित करें कि आपके दस्तावेज़ क्रम में हैं: आधार कार्ड, भूमि स्वामित्व रिकॉर्ड, और आधार से लिंक एक सक्रिय बैंक खाता।`,
    
    GOVT_EMPLOYEE_EXCLUSION: `दुर्भाग्य से, आप इस समय PM किसान के लिए पात्र नहीं हैं। चूंकि आप या आपके पति/पत्नी सरकारी कर्मचारी हैं, यह योजना आपके परिवार के लिए उपलब्ध नहीं है। सरकारी कर्मचारी और उनके परिवार PM किसान लाभ से बाहर हैं। हालांकि, आप MGNREGS (100 दिनों की गारंटीकृत रोजगार) या PM फसल बीमा योजना (फसल बीमा) जैसी अन्य योजनाओं के लिए पात्र हो सकते हैं। इन विकल्पों के बारे में अधिक जानने के लिए संबंधित वेबसाइटों पर जाएं।`,
    
    INCOME_TAX_EXCLUSION: `आप PM किसान सम्मान निधि के लिए पात्र नहीं हैं क्योंकि आपने या आपके पति/पत्नी ने पिछले निर्धारण वर्ष में आयकर का भुगतान किया था। आयकर दाताओं को इस योजना से बाहर रखा गया है क्योंकि यह सीमित आय वाले छोटे और सीमांत किसानों का समर्थन करने के लिए डिज़ाइन की गई है। फसल बीमा कवरेज के लिए PM फसल बीमा योजना का पता लगाने पर विचार करें, जो आयकर स्थिति की परवाह किए बिना सभी किसानों के लिए उपलब्ध है।`,
    
    NO_LAND_OWNERSHIP: `PM किसान के लिए आपके पास कृषि भूमि का स्वामित्व होना आवश्यक है। चूंकि आपके पास भूमि नहीं है, आप इस योजना के लिए पात्र नहीं हैं। हालांकि, भूमिहीन कृषि मजदूर के रूप में, आप MGNREGS (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना) के लिए पात्र हो सकते हैं, जो ग्रामीण परिवारों को प्रति वर्ष 100 दिनों के वेतन रोजगार की गारंटी देती है। अधिक जानने और आवेदन करने के लिए nrega.nic.in पर जाएं।`,
    
    INSTITUTIONAL_HOLDER: `कंपनियों, ट्रस्टों, स्कूलों या अन्य संगठनों जैसी संस्थाओं के स्वामित्व वाली भूमि PM किसान के लिए पात्र नहीं है। यह योजना विशेष रूप से व्यक्तिगत किसान परिवारों के लिए है। यदि आप संस्थागत भूमि पर काम करने वाले व्यक्तिगत किसान हैं, तो आप MGNREGS जैसी अन्य रोजगार या सहायता योजनाओं का पता लगाना चाह सकते हैं।`,
    
    LAND_SIZE_EXCEEDS_LIMIT: `आपकी ${userInputs.landSizeHectares} हेक्टेयर की भूमि ${userInputs.farmerCategory} किसान श्रेणी की सीमा से अधिक है। हालांकि आप इस श्रेणी के तहत पात्र नहीं हो सकते हैं, यदि आप फिर से आवेदन करते हैं तो आप "सभी किसान" श्रेणी के तहत पात्र हो सकते हैं। वैकल्पिक रूप से, फसल बीमा के लिए PM फसल बीमा योजना पर विचार करें, जो भूमि के आकार की परवाह किए बिना सभी किसानों के लिए उपलब्ध है।`,
    
    INVALID_LAND_SIZE: `आपके द्वारा प्रदान किया गया भूमि का आकार अमान्य प्रतीत होता है। कृपया अपने भूमि रिकॉर्ड सत्यापित करें और सुनिश्चित करें कि आप हेक्टेयर में सही भूमि क्षेत्र दर्ज करें। आप यह जानकारी अपने स्थानीय राजस्व कार्यालय से अपने खाता, खतौनी या अन्य आधिकारिक भूमि दस्तावेजों में पा सकते हैं।`,
    
    INVALID_CATEGORY: `आपके द्वारा चुनी गई किसान श्रेणी मान्य नहीं है। कृपया इनमें से चुनें: सीमांत किसान (1 हेक्टेयर तक), छोटे किसान (2 हेक्टेयर तक), या अन्य/निश्चित नहीं। अपनी कुल भूमि जोत के आधार पर सही श्रेणी निर्धारित करने के लिए अपने भूमि रिकॉर्ड की जांच करें।`
  };
  
  const explanations = language === 'hi' ? explanations_hi : explanations_en;
  
  let explanation = explanations[reasonCode] || (language === 'hi' 
    ? 'कृपया अपनी जानकारी सत्यापित करें और पुनः प्रयास करें।'
    : 'Please verify your information and try again.');
  
  // For Kannada and Telugu, add note that real AWS uses Amazon Translate
  if (language === 'kn' || language === 'te') {
    const langName = language === 'kn' ? 'Kannada' : 'Telugu';
    explanation = `[${langName} translation via Amazon Translate on AWS]\n\n${explanation}`;
  }
  
  return explanation;
}

/**
 * Eligibility check logic (same as Lambda)
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

  // Check exclusion criteria first
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
 * GET /scheme-data
 */
app.get('/scheme-data', (req, res) => {
  const { schemeId = 'pm-kisan', language = 'en' } = req.query;
  
  console.log(`📥 GET /scheme-data - schemeId: ${schemeId}, language: ${language}`);
  
  if (schemeId !== 'pm-kisan') {
    return res.status(404).json({
      error: 'Scheme not found',
      message: 'Only pm-kisan is supported in this MVP'
    });
  }

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

  console.log('✅ Scheme data sent');
  res.json(schemeData);
});

/**
 * POST /check-eligibility
 */
app.post('/check-eligibility', (req, res) => {
  const { userInputs, language = 'en' } = req.body;
  
  console.log(`📥 POST /check-eligibility - language: ${language}`);
  console.log('   User inputs:', JSON.stringify(userInputs, null, 2));
  
  if (!userInputs) {
    return res.status(400).json({
      error: 'Missing required field: userInputs'
    });
  }

  try {
    // Step 1: Check eligibility (real rules engine)
    const eligibilityResult = checkEligibility(userInputs, language);
    
    console.log(`   Result: ${eligibilityResult.eligible ? '✅ ELIGIBLE' : '❌ INELIGIBLE'} (${eligibilityResult.reasonCode})`);
    
    // Step 2: Generate mock AI explanation
    const explanation = generateMockExplanation(eligibilityResult, language);
    
    // Step 3: Combine results
    const response = {
      ...eligibilityResult,
      explanation
    };

    console.log('✅ Response sent');
    res.json(response);
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SahayakAI Local Mock Server is running' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  🚀 SahayakAI Local Mock Server');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log('  Endpoints:');
  console.log(`    GET  /scheme-data`);
  console.log(`    POST /check-eligibility`);
  console.log(`    GET  /health`);
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('✅ Server ready. Start the frontend with: npm run dev\n');
});
