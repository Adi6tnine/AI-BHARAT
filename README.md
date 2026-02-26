# SahayakAI 🇮🇳

AI-assisted government welfare scheme access platform for Indian citizens

**Built for the AI for Bharat Hackathon**

**Current Status**: ✅ Frontend UI Complete | ⚠️ Backend Ready for Deployment
frontend link-https://sahayak-aiforbharat.netlify.app/
---

## 📱 Live Demo Features

- **6 Languages**: English, Hindi, Kannada, Telugu, Tamil, Marathi
- **Modern UI**: Glass-morphism, smooth animations, mobile-first
- **Smart Forms**: Progressive validation, conditional fields
- **AI Explanations**: Plain-language guidance (powered by Amazon Bedrock)
- **Coming Soon**: 3 additional schemes in roadmap

---

## Problem Statement

Millions of Indian citizens are unaware of government welfare schemes they qualify for, or struggle to understand complex eligibility criteria written in legal/bureaucratic language. This leads to:

- Low scheme adoption rates
- Citizens missing benefits they deserve
- Confusion about eligibility requirements
- Language barriers (English-only documentation)

## Solution

SahayakAI helps citizens:
1. Check their eligibility for government schemes in under 30 seconds
2. Receive plain-language explanations in Hindi or English
3. Understand exactly why they qualify or don't qualify
4. Discover alternative schemes if ineligible

## MVP Scope

This MVP focuses on ONE scheme: **PM Kisan Samman Nidhi Yojana**

**Other schemes** (Ayushman Bharat, PM Awas, Skill India) show "Coming Soon" badges to demonstrate roadmap.

---

## 🎨 Current Implementation Status

### ✅ Fully Implemented (Frontend UI)
- **5 Modern Screens**: Language selector, dashboard, form, loading, results
- **6 Languages**: Full translations for en, hi, kn, te, ta, mr
- **Smart Form**: Progressive validation, conditional fields, 6 questions
- **Results Screen**: Success/error states, actionable steps, AI explanations
- **Coming Soon Feature**: Locked state for future schemes
- **Responsive Design**: Mobile-first, works on all devices
- **CSS Animations**: Confetti, fade-ins, smooth transitions (no JS libraries)

### ⚠️ Ready for Deployment (Backend)
- **Lambda Functions**: Eligibility check + AI explainer (code complete)
- **SAM Template**: Infrastructure as code ready
- **DynamoDB**: Scheme rules JSON ready
- **Local Testing**: Mock server for development

### 🚫 Not Implemented (Future)
- AI Chat Assistant (UI only, no backend)
- Voice Search (UI button only)
- Additional schemes (locked with "Coming Soon")
- Document upload
- User authentication

**See `CURRENT_STATUS.md` for detailed breakdown**

---

## 🤖 Where AI is Used

SahayakAI uses AI **ONLY for explanation**, never for eligibility decisions.

### AI Components

1. **Personalized Explanation Generation** (Amazon Bedrock - Claude 3 Haiku)
   - Adapts explanation based on user's land size, category, language
   - Different explanation for same eligibility in different contexts
   - Culturally appropriate language and examples

2. **Language Simplification**
   - Converts legal/bureaucratic language into simple terms
   - Adapts complexity based on inferred literacy level
   - Uses examples familiar to rural India

3. **Context-Aware Guidance**
   - Provides next steps based on user's specific situation
   - Suggests alternative schemes if ineligible
   - Explains rejection reasons in user's context

4. **Rejection Reason Interpretation**
   - Translates technical reason codes into human language
   - Provides context for why rule exists
   - Suggests corrective actions

### What AI Does NOT Do

- ❌ Make eligibility decisions (rules engine does this)
- ❌ Access or store PII
- ❌ Provide legal advice
- ❌ Predict future eligibility

**Architecture**:
```
User Input → Rules Engine (Deterministic) → Decision
                                              ↓
                                    Amazon Bedrock (AI)
                                              ↓
                                  Personalized Explanation → User
```

**See `AI_USAGE.md` for detailed documentation**

---

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Mobile-first responsive design
- Hosted on AWS Amplify

### Backend
- AWS Lambda (serverless functions)
- API Gateway (REST API)
- Amazon Bedrock (Claude 3 Haiku for AI explanations)
- Amazon Translate (Hindi translation)
- DynamoDB (scheme rules caching)

### Infrastructure
- AWS Amplify (CI/CD and hosting)
- CloudWatch (logging and monitoring)
- IAM (security and permissions)


## Architecture

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

## Key Features

### Implemented ✅
- **6 Languages**: English, Hindi, Kannada, Telugu, Tamil, Marathi
- **Modern UI**: Glass-morphism, smooth CSS animations, mobile-first design
- **Smart Forms**: Progressive validation, conditional fields, real-time progress
- **Rules-Based Decisions**: Deterministic eligibility checking (no AI guesswork)
- **AI Explanations**: Plain-language explanations from Amazon Bedrock
- **Actionable Steps**: Context-specific guidance for ineligible users
- **Coming Soon Feature**: Professional locked state for future schemes
- **Privacy-First**: No permanent storage of user data (session only)
- **Fast**: Results in under 5 seconds

### UI Only (No Backend) ⚠️
- **AI Chat Assistant**: Modal UI ready, needs backend integration
- **Voice Search**: Button present, needs Web Speech API integration

### Future Roadmap 🚀
- Additional schemes (Ayushman Bharat, PM Awas, Skill India)
- Document upload and verification
- User accounts for tracking applications
- Integration with government portals
- SMS-based access for feature phones

---

## Critical Design Principles

1. **AI NEVER makes eligibility decisions** - Only a rules engine does
2. **Bedrock is called ONLY after decision is made** - For explanations only
3. **No PII stored permanently** - Session storage only
4. **Mobile-first UI** - Optimized for smartphone users

## Project Structure

```
sahayakai/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Screen components
│   │   ├── utils/        # Helper functions
│   │   └── App.jsx       # Root component
│   ├── public/           # Static assets
│   └── package.json
├── backend/              # AWS Lambda functions
│   ├── functions/
│   │   ├── eligibilityCheck/  # Rules engine
│   │   ├── aiExplainer/       # Bedrock integration
│   │   └── schemeData/        # Scheme info API
│   ├── data/
│   │   └── pmkisan_rules.json # PM Kisan eligibility rules
│   └── package.json
├── infrastructure/       # AWS configuration
│   └── amplify.yml      # Amplify build config
└── README.md
```

## Documentation

**Quick Reference**:
- `CURRENT_STATUS.md` - **START HERE** - What's implemented vs. what needs backend
- `docs/DEPLOY.md` - Step-by-step deployment guide
- `docs/requirements.md` - Functional requirements and MVP scope
- `docs/design.md` - Architecture, tech stack, and design decisions
- `docs/spec.md` - Build specification and implementation guide

**Frontend Specific**:
- `frontend/README.md` - Frontend setup and API integration
- `frontend/FIXES_NEEDED.md` - Recent UI fixes and improvements
- `frontend/COMING_SOON_FEATURE.md` - "Coming Soon" feature documentation
- `frontend/ALL_FIXES_COMPLETE.md` - Summary of all UI fixes

---
## How to Run Locally

### Quick Start (Both Frontend + Backend)

```bash
cd sahayakai
./start-local.bat
```

This starts:
- Frontend on `http://localhost:5173`
- Mock backend on `http://localhost:3000`

### Prerequisites
- Node.js 18+ and npm
- (Optional) AWS Account for production deployment

---

### Frontend Only

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

**Note**: Uses mock API by default. Update `.env.local` for real backend.

---

### Backend (Local Mock Server)

```bash
cd backend
npm install
npm run local
```

Mock API server runs on `http://localhost:3000`

**Features**:
- No AWS credentials needed
- Returns mock eligibility responses
- Good for UI development and testing

---

### Backend (AWS Deployment)

**Prerequisites**:
- AWS Account with access to Lambda, API Gateway, Bedrock, Translate, DynamoDB
- AWS CLI configured with credentials
- AWS SAM CLI installed

**Steps**:

1. Install dependencies:
```bash
cd backend/functions/apiHandler
npm install
cd ../../..
```

2. Build and deploy:
```bash
cd backend
sam build
sam deploy --guided
```

3. Enable Bedrock access:
- Go to AWS Console → Bedrock
- Enable Claude 3 Haiku model in ap-south-1 region

4. Seed DynamoDB:
```bash
node scripts/seedDynamo.js
```

5. Update frontend with API URL:
```bash
cd ../frontend
# Edit .env.local
VITE_API_URL=https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod
```

**See `docs/DEPLOY.md` for detailed deployment guide**

---

## API Endpoints

### POST /api/check-eligibility
Check user eligibility for PM Kisan scheme

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
  "explanation": "आप PM किसान योजना के लिए पात्र हैं...",
  "requiredDocuments": ["Aadhaar Card", "Land Records", "Bank Account"]
}
```

### GET /api/scheme-data?schemeId=pm-kisan&language=en
Get scheme information

**Response:**
```json
{
  "schemeId": "pm-kisan",
  "name": "PM Kisan Samman Nidhi",
  "benefit": "₹6000 per year in 3 installments",
  "eligibilitySummary": ["Own farmland", "Small/marginal farmer"]
}
```


## User Flow (5 Screens)

1. **Language Selection** - Choose from 6 languages with modern card UI
2. **Scheme Dashboard** - View PM Kisan (available) + 3 locked schemes (coming soon)
3. **Eligibility Form** - Answer 6 smart questions with progressive validation
4. **Loading Screen** - Animated checklist while AI processes
5. **Results** - Eligible/ineligible with AI explanation + actionable steps

**Full flow takes under 30 seconds**

---

## PM Kisan Eligibility Rules (Summary)

### Eligible:
- Own agricultural land
- Small/marginal/all farmer categories
- Indian citizen

### Ineligible:
- Government employees or pensioners (>₹10k/month)
- Income tax payers
- Institutional landholders
- Professionals (doctors, lawyers, CAs, etc.)
- Constitutional post holders (MPs, MLAs, etc.)

See `backend/data/pmkisan_rules.json` for complete rules.

## Cost Estimate

For 10,000 users/month (2 checks per user):

- AWS Amplify: $0 (free tier)
- Lambda: ~$5
- API Gateway: ~$3
- Bedrock: ~$15 (Claude Haiku)
- Translate: ~$10
- DynamoDB: $0 (free tier)

**Total: ~$33/month**

## Security & Privacy

- No user authentication required
- No permanent storage of PII
- Session-only data retention
- HTTPS enforced
- API throttling (100 req/min per IP)
- Sanitized logs (no user inputs)

## Future Enhancements

### Phase 2 (Post-MVP)
- Add more schemes (PM Fasal Bima, MGNREGS, Ayushman Bharat, PM Awas, Skill India)
- AI Chat Assistant backend integration
- Voice search functionality
- Document upload and verification

### Phase 3 (Long-term)
- User accounts for tracking applications
- Integration with government portals for direct submission
- Regional language support (Bengali, Gujarati, Punjabi, etc.)
- Voice interface for low-literacy users
- SMS-based access for feature phones
- Progressive Web App (PWA) features
- Offline mode with service workers

---

## Contributing

This is a hackathon project. Contributions welcome!

## License

MIT License

## Contact

Built for AI for Bharat Hackathon 2024

---

**Note**: This is an MVP focused on PM Kisan scheme only. The eligibility rules are based on publicly available information and should be verified with official government sources before making any decisions.
