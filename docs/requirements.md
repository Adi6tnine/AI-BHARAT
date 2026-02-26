# SahayakAI - Requirements Document

## Problem Statement
Millions of Indian citizens are unaware of government welfare schemes they qualify for, or struggle to understand complex eligibility criteria written in legal/bureaucratic language. This leads to low scheme adoption and citizens missing benefits they deserve.

## Solution
SahayakAI is an AI-assisted platform that helps citizens check their eligibility for government schemes and receive plain-language explanations in their preferred language (Hindi/English).

## Target Users
- Rural and semi-urban Indian citizens
- Primary focus: Farmers and agricultural workers
- Age group: 25-60 years
- Digital literacy: Basic smartphone usage

## MVP Scope - PM Kisan Samman Nidhi Only
This MVP focuses exclusively on one scheme: PM Kisan Samman Nidhi Yojana

## Functional Requirements

### FR1: Language Selection
- User can choose Hindi or English at app start
- Language persists throughout session
- Can be changed anytime

### FR2: Scheme Information Display
- Show PM Kisan scheme overview
- Display benefit amount (₹6000/year in 3 installments)
- Show basic eligibility criteria summary

### FR3: Eligibility Check Form
- Collect minimal user inputs:
  - Land ownership status (Yes/No)
  - Land size in hectares
  - Farmer category (Small/Marginal/Other)
  - Government employee status (Yes/No)
  - Income tax payer status (Yes/No)
  - Institutional landholder status (Yes/No)
- Mobile-optimized form with clear labels
- Input validation

### FR4: Rules-Based Eligibility Decision
- Deterministic rules engine processes inputs
- Compares against pmkisan_rules.json criteria
- Returns: ELIGIBLE or INELIGIBLE with specific reason codes
- NO AI involvement in decision making

### FR5: AI-Generated Explanation
- After decision is made, call Amazon Bedrock
- Generate plain-language explanation in user's chosen language
- Explain WHY they are eligible/ineligible
- If ineligible, suggest alternative schemes
- If eligible, explain next steps

### FR6: Results Display
- Show eligibility decision clearly (visual indicator)
- Display AI-generated explanation
- Show required documents list (if eligible)
- Show alternative schemes (if ineligible)
- Provide "Check Another Scheme" option

## Non-Functional Requirements

### NFR1: Performance
- Eligibility check response < 2 seconds
- AI explanation generation < 5 seconds
- Mobile-first responsive design

### NFR2: Security & Privacy
- No permanent storage of user PII
- Session-only data retention
- HTTPS only
- No authentication required for MVP

### NFR3: Scalability
- Serverless architecture (AWS Lambda)
- Auto-scaling with demand
- DynamoDB for scheme rules caching

### NFR4: Accessibility
- Large touch targets (min 44x44px)
- High contrast text
- Simple language
- Works on 3G networks

### NFR5: Localization
- Hindi and English support
- Amazon Translate for dynamic content
- Culturally appropriate UI elements

## Out of Scope for MVP
- User accounts/authentication
- Multiple schemes (only PM Kisan)
- Document upload
- Application submission
- Payment tracking
- SMS/Email notifications
- Offline mode
- Voice input
- Regional languages beyond Hindi
