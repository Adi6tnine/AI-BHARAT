# SahayakAI Frontend

React-based frontend for the SahayakAI government scheme eligibility checker.

## Tech Stack

- React 18
- React Router v6
- Vite (build tool)
- Pure CSS Modules (no external UI libraries)
- Mobile-first responsive design

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LanguageSelector.jsx    # Screen 1: Language selection
│   │   ├── SchemeOverview.jsx      # Screen 2: PM Kisan overview
│   │   ├── EligibilityForm.jsx     # Screen 3: Form with 6 fields
│   │   ├── LoadingScreen.jsx       # Screen 4: Processing state
│   │   └── ResultsScreen.jsx       # Screen 5: Eligible/Ineligible results
│   ├── utils/
│   │   └── api.js                  # API utility functions
│   ├── App.jsx                     # Root component with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── package.json
├── .env.local                      # Local environment variables
└── .env.example                    # Example environment variables

```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API URL:

```
VITE_API_URL=http://localhost:3000
```

For production:
```
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Build output will be in `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## User Flow

1. **Language Selection** (`/`)
   - User chooses Hindi or English
   - Language saved to sessionStorage
   - Navigates to `/scheme`

2. **Scheme Overview** (`/scheme`)
   - Fetches PM Kisan data from API
   - Shows benefit amount and eligibility summary
   - User clicks "Check My Eligibility"
   - Navigates to `/form`

3. **Eligibility Form** (`/form`)
   - 6 form fields with validation
   - Submit calls API with user inputs
   - Navigates to `/loading` then `/results`

4. **Loading Screen** (`/loading`)
   - Shows spinner while API processes
   - Auto-redirects to `/results` when done

5. **Results Screen** (`/results`)
   - Shows eligible or ineligible state
   - Displays AI-generated explanation
   - Shows documents (if eligible) or alternatives (if ineligible)
   - User can check another scheme

## API Integration

### Endpoints Used

#### GET /scheme-data
Fetches scheme information

**Query Parameters:**
- `schemeId`: "pm-kisan"
- `language`: "en" or "hi"

**Response:**
```json
{
  "schemeId": "pm-kisan",
  "name": "PM Kisan Samman Nidhi",
  "description": "Income support scheme...",
  "benefit": "₹6000 per year in 3 installments",
  "benefitDetails": {...},
  "eligibilitySummary": [...],
  "officialWebsite": "https://pmkisan.gov.in"
}
```

#### POST /check-eligibility
Checks user eligibility

**Request Body:**
```json
{
  "userInputs": {
    "hasLand": true,
    "landSizeHectares": 1.5,
    "farmerCategory": "small",
    "isGovtEmployee": false,
    "isTaxPayer": false,
    "isInstitutionalHolder": false
  },
  "language": "en"
}
```

**Response:**
```json
{
  "eligible": true,
  "reasonCode": "ELIGIBLE_SMALL_FARMER",
  "reasonMessage": "You qualify as a small farmer...",
  "explanation": "AI-generated explanation...",
  "requiredDocuments": [...],
  "alternativeSchemes": [...],
  "userInputs": {...}
}
```

## Design System

### Colors
- Primary: `#1B5E20` (deep green)
- Secondary: `#FF8F00` (amber)
- Background: `#F5F5F5`
- Card background: `#FFFFFF`
- Success: `#2E7D32`
- Error: `#C62828`

### Typography
- Font: System font stack
- Base size: 16px
- Headings: 24-28px

### Components
- Cards: 12px border-radius, subtle shadow
- Buttons: 8px border-radius, min 48x48px
- Form inputs: 2px border, focus state
- Radio buttons: Custom styled, large touch targets

### Mobile-First
- Base width: 375px
- All touch targets: minimum 48x48px
- Responsive breakpoints in CSS
- Works on 3G networks

## State Management

### Language Context
- Provided by `App.jsx`
- Available to all components via `useContext(LanguageContext)`
- Persisted in sessionStorage

### Session Storage Keys
- `language`: "en" or "hi"
- `eligibilityResult`: Full API response object

## Error Handling

- API failures return `null` from utility functions
- Components show error messages and retry buttons
- Network errors logged to console
- User-friendly error messages in selected language

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- High contrast text
- Large touch targets (48x48px minimum)
- Screen reader friendly

## Performance Optimizations

- Code splitting by route (React Router)
- Lazy loading components
- Minimal dependencies (no heavy UI libraries)
- CSS modules for scoped styles
- Vite for fast builds and HMR

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Android Chrome)
- ES6+ features used (transpiled by Vite)

## Deployment

### AWS Amplify
1. Connect GitHub repository
2. Use `infrastructure/amplify.yml` for build settings
3. Set environment variable: `VITE_API_URL`
4. Deploy automatically on git push

### Manual Deployment
1. Build: `npm run build`
2. Upload `dist/` contents to hosting service
3. Configure environment variables
4. Ensure HTTPS is enabled

## Testing Checklist

- [ ] Language switching works
- [ ] Form validation prevents invalid submissions
- [ ] API calls succeed with correct data
- [ ] Loading screen shows during API call
- [ ] Results screen shows correct state (eligible/ineligible)
- [ ] Documents section expands/collapses
- [ ] Alternative schemes display correctly
- [ ] "Apply Now" opens pmkisan.gov.in
- [ ] "Check Another Scheme" returns to overview
- [ ] Mobile responsive on 375px width
- [ ] Works on 3G network speeds
- [ ] Hindi translations display correctly

## Known Limitations

- Only supports PM Kisan scheme (MVP scope)
- No user authentication
- No data persistence beyond session
- Requires internet connection
- English and Hindi only (no regional languages)

## Future Enhancements

- Add more schemes
- User accounts for tracking
- Document upload functionality
- Offline mode with service workers
- Voice input for low-literacy users
- Regional language support
- Progressive Web App (PWA) features
