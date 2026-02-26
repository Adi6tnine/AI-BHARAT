# SahayakAI - Design Document

## Architecture Overview

### High-Level Architecture
```
User (Mobile Browser)
    ↓
AWS Amplify (Hosting)
    ↓
React Frontend
    ↓
API Gateway (REST API)
    ↓
AWS Lambda Functions
    ↓
├── Amazon Bedrock (AI Explanations)
├── Amazon Translate (Language)
└── DynamoDB (Scheme Rules Cache)
```

## Frontend Design

### Technology Stack
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- CSS Modules for styling
- Mobile-first responsive design

### Screen Flow
1. Language Selection Screen
2. Scheme Overview Screen
3. Eligibility Form Screen
4. Processing/Loading Screen
5. Results Screen

### Component Structure
```
App.jsx
├── LanguageSelector
├── SchemeOverview
├── EligibilityForm
│   ├── FormField
│   └── FormValidation
├── LoadingSpinner
└── ResultsDisplay
    ├── EligibilityBadge
    ├── ExplanationCard
    ├── DocumentsList
    └── AlternativeSchemes
```

### State Management
- React Context for language preference
- Local component state for form data
- Session storage for temporary data (cleared on browser close)

## Backend Design

### Lambda Functions

#### 1. eligibilityCheck
**Purpose:** Evaluate user eligibility using rules engine

**Input:**
```json
{
  "schemeId": "pm-kisan",
  "userInputs": {
    "hasLand": true,
    "landSizeHectares": 1.5,
    "farmerCategory": "small",
    "isGovtEmployee": false,
    "isTaxPayer": false,
    "isInstitutionalHolder": false
  }
}
```

**Processing:**
1. Load PM Kisan rules from pmkisan_rules.json
2. Apply rules sequentially (exclusion criteria first)
3. Determine eligibility status
4. Identify specific reason codes

**Output:**
```json
{
  "eligible": true,
  "reasonCode": "ELIGIBLE_SMALL_FARMER",
  "reasonDetails": "Meets all criteria for small farmer category",
  "requiredDocuments": ["Aadhaar", "Land Records", "Bank Account"],
  "alternativeSchemes": []
}
```

#### 2. aiExplainer
**Purpose:** Generate plain-language explanation using Amazon Bedrock

**Input:**
```json
{
  "eligibilityResult": { /* output from eligibilityCheck */ },
  "language": "hi",
  "userInputs": { /* original form data */ }
}
```

**Processing:**
1. Construct prompt with eligibility decision and context
2. Call Amazon Bedrock (Claude 3 Haiku model)
3. If language is Hindi, translate using Amazon Translate
4. Return formatted explanation

**Prompt Template:**
```
You are explaining government scheme eligibility to an Indian citizen.

Scheme: PM Kisan Samman Nidhi
Decision: {ELIGIBLE/INELIGIBLE}
Reason: {reasonDetails}
User Profile: {userInputs summary}

Explain in simple language:
1. Whether they qualify and why
2. What this means for them
3. Next steps (if eligible) OR alternative options (if ineligible)

Keep it under 150 words. Be encouraging and helpful.
```

**Output:**
```json
{
  "explanation": "आप PM किसान योजना के लिए पात्र हैं...",
  "language": "hi"
}
```

#### 3. schemeData
**Purpose:** Fetch scheme information and rules

**Input:**
```json
{
  "schemeId": "pm-kisan",
  "language": "en"
}
```

**Output:**
```json
{
  "schemeId": "pm-kisan",
  "name": "PM Kisan Samman Nidhi",
  "description": "Income support for farmer families",
  "benefit": "₹6000 per year in 3 installments",
  "eligibilitySummary": ["Own farmland", "Small/marginal farmer", "Not a govt employee"],
  "officialWebsite": "https://pmkisan.gov.in"
}
```

## Database Design

### DynamoDB Tables

#### Table: SchemeRules
**Purpose:** Cache scheme rules for fast access

```
Partition Key: schemeId (String)
Sort Key: version (String)

Attributes:
- schemeId: "pm-kisan"
- version: "2024-01"
- rules: {JSON object from pmkisan_rules.json}
- lastUpdated: timestamp
- ttl: expiration timestamp
```

## AI Integration Design

### Amazon Bedrock Configuration
- Model: Claude 3 Haiku (fast, cost-effective)
- Max tokens: 300
- Temperature: 0.3 (more deterministic)
- Region: ap-south-1 (Mumbai)

### Prompt Engineering Principles
1. Clear role definition
2. Structured output format
3. Concise instructions
4. Context-aware (user profile + decision)
5. Culturally appropriate tone

### Amazon Translate Configuration
- Source: English (en)
- Target: Hindi (hi)
- Region: ap-south-1
- Formality: Informal (for accessibility)

## Security Design

### API Security
- API Gateway with throttling (100 req/min per IP)
- CORS enabled for Amplify domain only
- No authentication for MVP (public access)

### Data Privacy
- No PII stored in DynamoDB
- Lambda logs sanitized (no user inputs logged)
- Session data only (browser session storage)
- HTTPS enforced

### IAM Roles
- Lambda execution role with minimal permissions:
  - Bedrock: InvokeModel
  - Translate: TranslateText
  - DynamoDB: GetItem (read-only)
  - CloudWatch: PutLogEvents

## Error Handling

### Frontend
- Network errors: Retry with exponential backoff
- Validation errors: Inline form feedback
- API errors: User-friendly error messages in selected language

### Backend
- Lambda timeouts: 30 seconds max
- Bedrock failures: Fallback to template-based explanation
- DynamoDB failures: Load rules from bundled JSON file

## Monitoring & Logging

### CloudWatch Metrics
- Lambda invocation count
- Lambda duration
- API Gateway 4xx/5xx errors
- Bedrock API call count

### CloudWatch Logs
- Lambda execution logs (sanitized)
- API Gateway access logs
- Error traces with correlation IDs

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy load components
- Compress images
- CDN via Amplify

### Backend
- Lambda warm-up (provisioned concurrency: 2)
- DynamoDB caching (TTL: 24 hours)
- Bedrock response streaming (if supported)
- Gzip compression on API responses

## Deployment Strategy

### CI/CD Pipeline
1. Git push to main branch
2. AWS Amplify auto-build
3. Frontend deployed to CDN
4. Lambda functions deployed via AWS SAM/CDK
5. API Gateway updated

### Environments
- Development: dev.sahayakai.amplifyapp.com
- Production: sahayakai.amplifyapp.com

## Cost Estimation (Monthly)

Assumptions: 10,000 users/month, 2 checks per user

- AWS Amplify: $0 (free tier)
- Lambda: ~$5 (20,000 invocations)
- API Gateway: ~$3 (20,000 requests)
- Bedrock: ~$15 (20,000 calls, Haiku model)
- Translate: ~$10 (10,000 translations)
- DynamoDB: $0 (free tier)

**Total: ~$33/month**
