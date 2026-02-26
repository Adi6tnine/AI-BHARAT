/**
 * AI Helper Functions for Personalized Checklist
 * These generate context-aware insights based on user inputs
 */

/**
 * Generate conditional checklist steps based on user inputs
 */
export function generateChecklistSteps(userInputs, language = 'en') {
  const steps = [];
  
  // Step 1: Aadhaar linking (always show for eligible users)
  steps.push({
    id: 'aadhaar',
    title: language === 'hi' 
      ? 'आधार को बैंक से लिंक करें' 
      : 'Link Aadhaar to bank account',
    subtitle: language === 'hi'
      ? 'अपनी स्थानीय बैंक शाखा पर जाएं'
      : 'Visit your local bank branch',
    aiInsight: language === 'hi'
      ? `${userInputs.farmerCategory === 'marginal' ? 'सीमांत' : 'छोटे'} किसानों के लिए आधार लिंकिंग अनिवार्य है। 60% आवेदन इसी कारण अस्वीकार होते हैं।`
      : `Aadhaar linking is mandatory for ${userInputs.farmerCategory} farmers. 60% of rejections happen due to this.`,
    whyMatters: language === 'hi'
      ? `आपकी ${userInputs.landSizeHectares} हेक्टेयर भूमि के लिए, DBT भुगतान केवल आधार-लिंक्ड खाते में ही आएगा। बिना लिंकिंग के आवेदन स्वीकार नहीं होगा।`
      : `For your ${userInputs.landSizeHectares} hectare land, DBT payments only go to Aadhaar-linked accounts. Without linking, your application won't be accepted.`,
    completed: false,
    priority: 'high'
  });

  // Step 2: Land records verification (conditional based on land size)
  if (userInputs.landSizeHectares <= 1.0) {
    steps.push({
      id: 'land-records',
      title: language === 'hi'
        ? 'भूमि रिकॉर्ड सत्यापित करें'
        : 'Verify land records carefully',
      subtitle: language === 'hi'
        ? 'भूलेख / भूमि पोर्टल पर जाएं'
        : 'Check Bhulekh / Bhoomi portal',
      aiInsight: language === 'hi'
        ? `${userInputs.landSizeHectares} हेक्टेयर के साथ, आप सीमांत किसान श्रेणी में हैं। माप में छोटी त्रुटि भी अपात्रता का कारण बन सकती है।`
        : `With ${userInputs.landSizeHectares} hectares, you're in marginal farmer category. Even small measurement errors can cause rejection.`,
      whyMatters: language === 'hi'
        ? 'सीमांत किसानों के लिए भूमि माप की सटीकता महत्वपूर्ण है। सुनिश्चित करें कि आपके दस्तावेज़ों में भूमि का आकार सही है।'
        : 'For marginal farmers, land measurement accuracy is critical. Ensure your documents show the correct land size.',
      completed: false,
      priority: 'high'
    });
  } else {
    steps.push({
      id: 'land-records',
      title: language === 'hi'
        ? 'भूमि रिकॉर्ड की जांच करें'
        : 'Check land records',
      subtitle: language === 'hi'
        ? 'भूलेख / भूमि पोर्टल पर जाएं'
        : 'Check Bhulekh / Bhoomi portal',
      aiInsight: language === 'hi'
        ? `${userInputs.landSizeHectares} हेक्टेयर के साथ, सुनिश्चित करें कि भूमि आपके नाम पर पंजीकृत है।`
        : `With ${userInputs.landSizeHectares} hectares, ensure land is registered in your name.`,
      whyMatters: language === 'hi'
        ? 'भूमि स्वामित्व दस्तावेज़ आपके आधार नाम से मेल खाने चाहिए। बेमेल नाम सबसे आम अस्वीकृति कारण है।'
        : 'Land ownership documents must match your Aadhaar name. Name mismatch is the most common rejection reason.',
      completed: false,
      priority: 'medium'
    });
  }

  // Step 3: Document preparation (conditional based on category)
  if (userInputs.farmerCategory === 'marginal') {
    steps.push({
      id: 'documents',
      title: language === 'hi'
        ? 'सीमांत किसान प्रमाण पत्र तैयार करें'
        : 'Prepare marginal farmer certificate',
      subtitle: language === 'hi'
        ? 'तहसील या राजस्व कार्यालय से प्राप्त करें'
        : 'Obtain from Tehsil or Revenue office',
      aiInsight: language === 'hi'
        ? 'सीमांत किसान श्रेणी के लिए अतिरिक्त प्रमाणीकरण की आवश्यकता हो सकती है।'
        : 'Marginal farmer category may require additional certification.',
      whyMatters: language === 'hi'
        ? 'कुछ राज्यों में सीमांत किसानों को श्रेणी प्रमाण पत्र की आवश्यकता होती है। पहले से तैयार रखें।'
        : 'Some states require category certificate for marginal farmers. Keep it ready in advance.',
      completed: false,
      priority: 'medium'
    });
  } else {
    steps.push({
      id: 'documents',
      title: language === 'hi'
        ? 'दस्तावेज़ तैयार रखें'
        : 'Keep documents ready',
      subtitle: language === 'hi'
        ? 'आधार कार्ड + बैंक पासबुक + भूमि दस्तावेज़'
        : 'Aadhaar card + Bank Passbook + Land documents',
      aiInsight: language === 'hi'
        ? 'सभी दस्तावेज़ों की स्पष्ट प्रतियां रखें। धुंधली प्रतियां अस्वीकृति का कारण बनती हैं।'
        : 'Keep clear copies of all documents. Blurry copies cause rejections.',
      whyMatters: language === 'hi'
        ? 'आवेदन के समय सभी दस्तावेज़ों की आवश्यकता होगी। अधूरे आवेदन स्वीकार नहीं किए जाते।'
        : 'All documents will be needed during application. Incomplete applications are not accepted.',
      completed: false,
      priority: 'medium'
    });
  }

  return steps;
}

/**
 * Calculate readiness score based on user profile
 */
export function calculateReadinessScore(userInputs) {
  let score = 50; // Base score
  
  // Positive factors
  if (userInputs.farmerCategory === 'small' || userInputs.farmerCategory === 'marginal') {
    score += 20; // Clear category
  }
  
  if (userInputs.landSizeHectares > 0 && userInputs.landSizeHectares <= 2) {
    score += 15; // Within limits
  }
  
  if (!userInputs.isGovtEmployee && !userInputs.isTaxPayer) {
    score += 15; // No exclusions
  }
  
  // Cap at 90% (never 100% without actual verification)
  return Math.min(score, 90);
}

/**
 * Generate contextual AI warning with prevention logic
 */
export function generateAIWarning(userInputs, language = 'en') {
  const warnings = {
    en: {
      whatGoesWrong: '',
      whatToCheck: '',
      whenToDo: ''
    },
    hi: {
      whatGoesWrong: '',
      whatToCheck: '',
      whenToDo: ''
    }
  };

  // Warning 1: Land size near boundary
  if (userInputs.landSizeHectares >= 0.9 && userInputs.landSizeHectares <= 1.1) {
    warnings.en = {
      whatGoesWrong: '❌ Farmers with land size near 1 hectare often face verification delays',
      whatToCheck: '✅ Double-check your land records show exact measurements',
      whenToDo: '🕒 Before applying - verify at Tehsil office'
    };
    warnings.hi = {
      whatGoesWrong: '❌ 1 हेक्टेयर के पास भूमि वाले किसानों को अक्सर सत्यापन में देरी होती है',
      whatToCheck: '✅ सुनिश्चित करें कि आपके रिकॉर्ड सटीक माप दिखाते हैं',
      whenToDo: '🕒 आवेदन से पहले - तहसील कार्यालय में सत्यापित करें'
    };
  }
  // Warning 2: Marginal farmer category
  else if (userInputs.farmerCategory === 'marginal') {
    warnings.en = {
      whatGoesWrong: '❌ Marginal farmers are often rejected due to name mismatch between Aadhaar and land records',
      whatToCheck: `✅ Verify spelling matches exactly across all documents (Your land: ${userInputs.landSizeHectares} hectares)`,
      whenToDo: '🕒 Before applying - compare Aadhaar card with land documents'
    };
    warnings.hi = {
      whatGoesWrong: '❌ सीमांत किसानों को अक्सर आधार और भूमि रिकॉर्ड के बीच नाम बेमेल के कारण अस्वीकार किया जाता है',
      whatToCheck: `✅ सभी दस्तावेज़ों में वर्तनी बिल्कुल मेल खाती है यह सत्यापित करें (आपकी भूमि: ${userInputs.landSizeHectares} हेक्टेयर)`,
      whenToDo: '🕒 आवेदन से पहले - आधार कार्ड की तुलना भूमि दस्तावेज़ों से करें'
    };
  }
  // Warning 3: Small farmer with larger land
  else if (userInputs.farmerCategory === 'small' && userInputs.landSizeHectares > 1.5) {
    warnings.en = {
      whatGoesWrong: `❌ Farmers with ${userInputs.landSizeHectares} hectares sometimes face category verification`,
      whatToCheck: '✅ Keep land ownership documents ready for verification',
      whenToDo: '🕒 Before applying - get documents certified by Tehsildar'
    };
    warnings.hi = {
      whatGoesWrong: `❌ ${userInputs.landSizeHectares} हेक्टेयर वाले किसानों को कभी-कभी श्रेणी सत्यापन का सामना करना पड़ता है`,
      whatToCheck: '✅ सत्यापन के लिए भूमि स्वामित्व दस्तावेज़ तैयार रखें',
      whenToDo: '🕒 आवेदन से पहले - तहसीलदार से दस्तावेज़ प्रमाणित करवाएं'
    };
  }
  // Default warning
  else {
    warnings.en = {
      whatGoesWrong: '❌ Most rejections happen due to Aadhaar-bank linking issues or name mismatches',
      whatToCheck: '✅ Verify Aadhaar is linked to your active bank account',
      whenToDo: '🕒 Before applying - visit bank branch to confirm linking'
    };
    warnings.hi = {
      whatGoesWrong: '❌ अधिकांश अस्वीकृतियां आधार-बैंक लिंकिंग या नाम बेमेल के कारण होती हैं',
      whatToCheck: '✅ सत्यापित करें कि आधार आपके सक्रिय बैंक खाते से लिंक है',
      whenToDo: '🕒 आवेदन से पहले - लिंकिंग की पुष्टि के लिए बैंक शाखा जाएं'
    };
  }

  return language === 'hi' ? warnings.hi : warnings.en;
}

/**
 * Generate readiness message
 */
export function getReadinessMessage(score, language = 'en') {
  if (score >= 80) {
    return language === 'hi'
      ? `आप ${score}% तैयार हैं - उच्च स्वीकृति संभावना`
      : `You are ${score}% ready - High approval chance`;
  } else if (score >= 60) {
    return language === 'hi'
      ? `आप ${score}% तैयार हैं - ऊपर दिए गए चरणों का पालन करें`
      : `You are ${score}% ready - Follow steps above`;
  } else {
    return language === 'hi'
      ? `आप ${score}% तैयार हैं - सभी चरणों को पूरा करें`
      : `You are ${score}% ready - Complete all steps`;
  }
}
