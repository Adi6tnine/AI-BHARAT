/**
 * AI Explainer Lambda Function
 * 
 * CRITICAL: This function ONLY generates explanations
 * - Receives a completed decision from eligibilityCheck
 * - Does NOT make any eligibility decisions
 * - Calls Amazon Bedrock for plain-language explanation
 * - Translates to Hindi if requested
 */

import { 
  BedrockRuntimeClient, 
  InvokeModelCommand 
} from '@aws-sdk/client-bedrock-runtime';
import { 
  TranslateClient, 
  TranslateTextCommand 
} from '@aws-sdk/client-translate';

const bedrockClient = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || 'ap-south-1' 
});

const translateClient = new TranslateClient({ 
  region: process.env.AWS_REGION || 'ap-south-1' 
});

const BEDROCK_MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

/**
 * Generate AI explanation for eligibility decision
 * 
 * @param {Object} eligibilityResult - Result from eligibilityCheck
 * @param {string} language - en or hi
 * @returns {Promise<string>} Plain-language explanation
 */
export async function generateExplanation(eligibilityResult, language = 'en') {
  const { eligible, reasonMessage, userInputs } = eligibilityResult;
  
  // Construct prompt for Bedrock
  const prompt = `You are a helpful assistant explaining government scheme results to an Indian farmer. The eligibility decision has already been made by an official rules engine — you are only explaining it clearly.

Scheme: PM Kisan Samman Nidhi
Decision: ${eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
Official Reason: ${reasonMessage}
Farmer Profile: Land size ${userInputs.landSizeHectares} hectares, Category: ${userInputs.farmerCategory}

Write a warm, simple explanation (under 150 words) that:
1. States the result clearly
2. Explains the reason in plain language a farmer would understand
3. If eligible: lists 2-3 important next steps
4. If ineligible: mentions 1 alternative scheme they may qualify for

Do not use legal language. Do not make any new eligibility claims.`;

  try {
    // Call Bedrock
    const bedrockRequest = {
      modelId: BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 300,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    };

    const bedrockCommand = new InvokeModelCommand(bedrockRequest);
    const bedrockResponse = await bedrockClient.send(bedrockCommand);
    
    // Parse Bedrock response
    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
    let explanation = responseBody.content[0].text.trim();

    // Translate to Hindi if requested
    if (language === 'hi') {
      const translateCommand = new TranslateTextCommand({
        Text: explanation,
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'hi'
      });
      
      const translateResponse = await translateClient.send(translateCommand);
      explanation = translateResponse.TranslatedText;
    }

    return explanation;
  } catch (error) {
    console.error('Error generating explanation:', error);
    
    // Fallback to template-based explanation if Bedrock fails
    return generateFallbackExplanation(eligibilityResult, language);
  }
}

/**
 * Fallback explanation if Bedrock fails
 */
function generateFallbackExplanation(eligibilityResult, language) {
  const { eligible, reasonMessage, requiredDocuments, alternativeSchemes } = eligibilityResult;
  
  if (language === 'hi') {
    if (eligible) {
      return `${reasonMessage}\n\nअगले कदम:\n1. अपने आधार कार्ड को बैंक खाते से लिंक करें\n2. अपने भूमि रिकॉर्ड तैयार रखें\n3. PM किसान पोर्टल पर पंजीकरण करें: https://pmkisan.gov.in`;
    } else {
      const altScheme = alternativeSchemes[0];
      return `${reasonMessage}\n\nवैकल्पिक योजना: ${altScheme.name} - ${altScheme.description}\nअधिक जानकारी: ${altScheme.website}`;
    }
  } else {
    if (eligible) {
      return `${reasonMessage}\n\nNext steps:\n1. Link your Aadhaar to your bank account\n2. Keep your land records ready\n3. Register on PM Kisan portal: https://pmkisan.gov.in`;
    } else {
      const altScheme = alternativeSchemes[0];
      return `${reasonMessage}\n\nAlternative scheme: ${altScheme.name} - ${altScheme.description}\nLearn more: ${altScheme.website}`;
    }
  }
}

/**
 * Lambda handler
 */
export async function handler(event) {
  try {
    // Parse request body
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { eligibilityResult, language = 'en' } = body;

    // Validate required fields
    if (!eligibilityResult) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Missing required field: eligibilityResult'
        })
      };
    }

    // Generate explanation
    const explanation = await generateExplanation(eligibilityResult, language);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        explanation,
        language
      })
    };
  } catch (error) {
    console.error('Error in AI explainer:', error);
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
