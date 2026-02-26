# SahayakAI - Build Specification (MVP)

## Executive Summary
SahayakAI MVP is a single-scheme eligibility checker for PM Kisan Samman Nidhi with AI-powered explanations. The system uses a deterministic rules engine for decisions and Amazon Bedrock only for generating plain-language explanations.

## Exact 5-Screen User Flow

### Screen 1: Language Selection
**Purpose:** Choose interface language

**UI Elements:**
- App logo and name
- Two large buttons: "हिंदी" and "English"
- Tagline: "Check your eligibility for government schemes"

**User Action:** Tap language button

**Next:** Screen 2

---

### Screen 2: Scheme Overview
**Purpose:** Introduce PM Kisan scheme

**UI Elements:**
- Scheme name and logo
- Benefit card: "₹6000 per year in 3 installments"
- Brief description (3-4 lines)
- Eligibility summary (3 bullet points)
- "Check My Eligibility" button

**User Action:** Tap "Check My Eligibility"

**Next:** Screen 3

---

### Screen 3: Eligibility Form
**Purpose:** Collect user inputs for eligibility check

**Form Fields:**
1. Do you own agricultural land? (Yes/No radio buttons)
2. Land size in hectares (Number input, shown only if Yes above)
3. Farmer category (Dropdown: Small/Marginal/Other)
4. Are you or your spouse a government employee? (Yes/No)
5. Did you or your spouse pay income tax last year? (Yes/No)
6. Is the land owned by an institution? (Yes/No with info icon)

**Validation:**
- All fields mandatory
- Land size must be > 0 if land ownership is Yes
- Show inline error messages

**User Action:** Tap "Check Eligibility" button

**Next:** Screen 4 (loading) → Screen 5 (results)

---

### Screen 4: Processing
**Purpose:** Show loading state while checking eligibility

**UI Elements:**
- Animated spinner
- Text: "Checking your eligibility..."
- Subtext: "This will take a few seconds"

**Duration:** 2-5 seconds (rules engine + AI explanation)

**Next:** Screen 5 (auto-transition)

---

### Screen 5: Results
**Purpose:** Display eligibility decision and explanation

**UI Elements:**

**If ELIGIBLE:**
- ✅ Green badge: "You are eligible!"
- AI-generated explanation card (in chosen language)
- "Required Documents" section (expandable list)
- "Next Steps" section with application link
- "Check Another Scheme" button

**If INELIGIBLE:**
- ❌ Red badge: "Not eligible for PM Kisan"
- AI-generated explanation card (in chosen language)
- "Why?" section with specific reason
- "Alternative Schemes" section (2 cards with brief info)
- "Check Another Scheme" button

**User Action:** 
- Read explanation
- Tap "Check Another Scheme" to return to Screen 2
- Tap alternative scheme cards to see more info (future scope)

---

## AI Boundary Definition

### What AI (Amazon Bedrock) DOES:
1. Generate plain-language explanations AFTER eligibility decision is made
2. Translate technical reason codes into user-friendly language
3. Provide encouraging, helpful tone
4. Suggest next steps or alternatives based on decision

### What AI DOES NOT DO:
1. ❌ Make eligibility decisions
2. ❌ Interpret rules or criteria
3. ❌ Override rules engine output
4. ❌ Access or process user PII directly
5. ❌ Store any user data
6. ❌ Provide legal advice

### Decision Flow:
```
User Input → Rules Engine (pmkisan_rules.json) → Decision (ELIGIBLE/INELIGIBLE + Reason Code)
                                                          ↓
                                    Amazon Bedrock ← Decision + Context
                                                          ↓
                                    Plain-language Explanation → User
```

## Data Flow Diagram (Text)

```
┌─────────────┐
│   Browser   │
│  (Session   │
│   Storage)  │
└──────┬──────┘
       │ 1. User submits form
       ↓
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│              (REST API Endpoint)                        │
└──────┬──────────────────────────────────┬──────────────┘
       │                                   │
       │ 2. POST /check-eligibility        │ 3. POST /explain
       ↓                                   ↓
┌──────────────────┐              ┌──────────────────┐
│ Lambda:          │              │ Lambda:          │
│ eligibilityCheck │              │ aiExplainer      │
└────┬─────────────┘              └────┬─────────────┘
     │                                  │
     │ 4. Load rules                    │ 7. Generate explanation
     ↓                                  ↓
┌──────────────────┐              ┌──────────────────┐
│   DynamoDB:      │              │ Amazon Bedrock   │
│  SchemeRules     │              │ (Claude Haiku)   │
│  (Cache)         │              └────┬─────────────┘
└────┬─────────────┘                   │
     │                                  │ 8. Translate (if Hindi)
     │ 5. Apply rules                   ↓
     │    (Pure logic)             ┌──────────────────┐
     │                             │ Amazon Translate │
     ↓                             └────┬─────────────┘
┌──────────────────┐                   │
│ Decision:        │                   │
│ ELIGIBLE/        │ ←─────────────────┘
│ INELIGIBLE       │ 9. Return explanation
│ + Reason Code    │
└────┬─────────────┘
     │
     │ 6. Return to frontend
     ↓
┌─────────────┐
│   Browser   │
│  (Display)  │
└─────────────┘
```

## Component Responsibilities

### Frontend Components

#### App.jsx
- Root component
- Manages routing between screens
- Provides language context to all children
- Handles session storage for language preference

#### LanguageSelector.jsx
- Renders language selection buttons
- Saves language choice to context and session storage
- Navigates to SchemeOverview on selection

#### SchemeOverview.jsx
- Fetches scheme data from `/api/scheme-data?schemeId=pm-kisan&language={lang}`
- Displays scheme information
- Navigates to EligibilityForm on button click

#### EligibilityForm.jsx
- Renders form fields with validation
- Manages form state
- Calls `/api/check-eligibility` with form data
- Shows loading state
- Navigates to Results on response

#### Results.jsx
- Receives eligibility decision and explanation as props
- Renders appropriate UI based on eligible/ineligible status
- Displays AI-generated explanation
- Shows documents list or alternative schemes
- Provides "Check Another Scheme" action

### Backend Lambda Functions

#### eligibilityCheck (functions/eligibilityCheck/index.js)
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

**Responsibilities:**
1. Load PM Kisan rules from DynamoDB (with fallback to bundled JSON)
2. Apply exclusion criteria first (govt employee, tax payer, institutional holder)
3. If not excluded, check land ownership and category
4. Determine eligibility status and reason code
5. Return decision with required documents or alternative schemes

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

**Rules Logic:**
```javascript
// Exclusion checks (any true = ineligible)
if (isGovtEmployee) return INELIGIBLE("GOVT_EMPLOYEE_EXCLUSION")
if (isTaxPayer) return INELIGIBLE("INCOME_TAX_EXCLUSION")
if (isInstitutionalHolder) return INELIGIBLE("INSTITUTIONAL_HOLDER")

// Inclusion checks
if (!hasLand) return INELIGIBLE("NO_LAND_OWNERSHIP")
if (farmerCategory === "small" && landSizeHectares <= 2.0) return ELIGIBLE("ELIGIBLE_SMALL_FARMER")
if (farmerCategory === "marginal" && landSizeHectares <= 1.0) return ELIGIBLE("ELIGIBLE_MARGINAL_FARMER")
if (farmerCategory === "all") return ELIGIBLE("ELIGIBLE_ALL_FARMERS")

return INELIGIBLE("LAND_SIZE_EXCEEDS_LIMIT")
```

#### aiExplainer (functions/aiExplainer/index.js)
**Input:**
```json
{
  "eligibilityResult": { /* from eligibilityCheck */ },
  "language": "hi",
  "userInputs": { /* original form data */ }
}
```

**Responsibilities:**
1. Construct prompt with eligibility decision and user context
2. Call Amazon Bedrock (Claude 3 Haiku) with prompt
3. If language is Hindi, translate using Amazon Translate
4. Return formatted explanation

**Prompt Template:**
```
You are explaining government scheme eligibility to an Indian citizen.

Scheme: PM Kisan Samman Nidhi
Decision: {ELIGIBLE/INELIGIBLE}
Reason: {reasonDetails}
User Profile: {userInputs summary}

Explain in simple, encouraging language:
1. Whether they qualify and why
2. What this means for them
3. Next steps (if eligible) OR alternative options (if ineligible)

Keep it under 150 words. Be helpful and culturally appropriate.
```

**Output:**
```json
{
  "explanation": "आप PM किसान योजना के लिए पात्र हैं क्योंकि...",
  "language": "hi"
}
```

#### schemeData (functions/schemeData/index.js)
**Input:**
```json
{
  "schemeId": "pm-kisan",
  "language": "en"
}
```

**Responsibilities:**
1. Fetch scheme metadata from DynamoDB or bundled JSON
2. Return scheme name, description, benefit, eligibility summary
3. Translate if language is Hindi

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

## Explicitly OUT OF SCOPE for MVP

### Features NOT Included:
1. ❌ User authentication/login
2. ❌ User profiles or saved data
3. ❌ Multiple schemes (only PM Kisan)
4. ❌ Document upload functionality
5. ❌ Application submission to government
6. ❌ Payment tracking
7. ❌ SMS/Email notifications
8. ❌ Offline mode
9. ❌ Voice input/output
10. ❌ Regional languages beyond Hindi/English
11. ❌ Admin panel
12. ❌ Analytics dashboard
13. ❌ Scheme comparison
14. ❌ Chatbot interface
15. ❌ Social sharing

### Technical Limitations:
1. No persistent user data storage
2. No real-time updates
3. No integration with government APIs (uses static rules)
4. No document verification
5. No payment processing

### Future Enhancements (Post-MVP):
1. Add more schemes (PM Fasal Bima, MGNREGS, etc.)
2. User accounts for tracking applications
3. Document upload and verification
4. Integration with government portals
5. Regional language support
6. Voice interface for low-literacy users
7. SMS-based access for feature phones

## API Endpoints

### POST /api/check-eligibility
**Request:**
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

**Response:**
```json
{
  "eligible": true,
  "reasonCode": "ELIGIBLE_SMALL_FARMER",
  "reasonDetails": "Meets all criteria for small farmer category",
  "requiredDocuments": ["Aadhaar Card", "Land Records", "Bank Account"],
  "alternativeSchemes": [],
  "explanation": "आप PM किसान योजना के लिए पात्र हैं..."
}
```

### GET /api/scheme-data?schemeId=pm-kisan&language=en
**Response:**
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

## Testing Strategy

### Unit Tests
- Rules engine logic (all eligibility scenarios)
- Form validation
- API response parsing

### Integration Tests
- Lambda function invocations
- Bedrock API calls
- Translate API calls
- DynamoDB queries

### E2E Tests
- Complete user flow (5 screens)
- Language switching
- Eligible scenario
- Ineligible scenario

### Manual Testing Checklist
- [ ] Mobile responsiveness (iOS Safari, Android Chrome)
- [ ] Hindi translation accuracy
- [ ] AI explanation quality and tone
- [ ] Error handling (network failures)
- [ ] Loading states
- [ ] Accessibility (screen reader, keyboard navigation)

## Success Metrics

### Technical Metrics
- API response time < 2s (eligibility check)
- AI explanation generation < 5s
- 99% uptime
- Zero PII leaks

### User Metrics
- Completion rate > 80% (Screen 1 → Screen 5)
- Bounce rate < 20% on Screen 3
- User satisfaction (post-MVP survey)

## Deployment Checklist

- [ ] Frontend deployed to AWS Amplify
- [ ] Lambda functions deployed
- [ ] API Gateway configured
- [ ] DynamoDB table created and seeded
- [ ] Bedrock access enabled in ap-south-1
- [ ] Translate access enabled
- [ ] IAM roles configured
- [ ] Environment variables set
- [ ] CORS configured
- [ ] HTTPS enforced
- [ ] Error logging enabled
- [ ] Cost alerts configured
