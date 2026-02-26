# SahayakAI Deployment Guide

Complete step-by-step guide to deploy SahayakAI to AWS.

---

## Prerequisites

- AWS Account with admin access
- Node.js 18+ installed
- Git installed
- GitHub account (for Amplify deployment)

---

## Step 1: Install AWS SAM CLI

### macOS
```bash
brew install aws-sam-cli
```

### Windows
Download from: https://aws.amazon.com/serverless/sam/

Or use Chocolatey:
```bash
choco install aws-sam-cli
```

### Linux
```bash
# Download the installer
wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip

# Unzip and install
unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
sudo ./sam-installation/install
```

Verify installation:
```bash
sam --version
```

---

## Step 2: Configure AWS Credentials

```bash
aws configure
```

Enter the following when prompted:
- **AWS Access Key ID**: Your access key
- **AWS Secret Access Key**: Your secret key
- **Default region name**: `ap-south-1` (Mumbai)
- **Default output format**: `json`

Verify configuration:
```bash
aws sts get-caller-identity
```

---

## Step 3: Test Backend Logic Locally

Before deploying, verify the eligibility logic works correctly:

```bash
cd backend
node scripts/testLocal.js
```

Expected output:
```
═══════════════════════════════════════════════════════
  SahayakAI - Local Eligibility Logic Tests
═══════════════════════════════════════════════════════

Test 1: Small farmer, 1.5 hectares
────────────────────────────────────────────────────────
✅ PASS
   Expected: eligible=true, reasonCode=ELIGIBLE_SMALL_FARMER
   Got:      eligible=true, reasonCode=ELIGIBLE_SMALL_FARMER

Test 2: Government employee
────────────────────────────────────────────────────────
✅ PASS
   Expected: eligible=false, reasonCode=GOVT_EMPLOYEE_EXCLUSION
   Got:      eligible=false, reasonCode=GOVT_EMPLOYEE_EXCLUSION

Test 3: No land ownership
────────────────────────────────────────────────────────
✅ PASS
   Expected: eligible=false, reasonCode=NO_LAND_OWNERSHIP
   Got:      eligible=false, reasonCode=NO_LAND_OWNERSHIP

Test 4: Marginal farmer, 0.8 hectares
────────────────────────────────────────────────────────
✅ PASS
   Expected: eligible=true, reasonCode=ELIGIBLE_MARGINAL_FARMER
   Got:      eligible=true, reasonCode=ELIGIBLE_MARGINAL_FARMER

Test 5: Income tax payer
────────────────────────────────────────────────────────
✅ PASS
   Expected: eligible=false, reasonCode=INCOME_TAX_EXCLUSION
   Got:      eligible=false, reasonCode=INCOME_TAX_EXCLUSION

═══════════════════════════════════════════════════════
  Results: 5 PASSED, 0 FAILED
═══════════════════════════════════════════════════════

✅ All tests passed! Ready to deploy.
```

If any tests fail, do NOT proceed with deployment.

---

## Step 4: Build and Deploy Backend

```bash
cd backend

# Install dependencies for all Lambda functions
cd functions/apiHandler
npm install
cd ../..

# Build the SAM application
sam build

# Deploy with guided prompts
sam deploy --guided
```

### Deployment Prompts

Answer the prompts as follows:

```
Stack Name [sahayakai-backend]: sahayakai-backend
AWS Region [ap-south-1]: ap-south-1
Confirm changes before deploy [Y/n]: Y
Allow SAM CLI IAM role creation [Y/n]: Y
Disable rollback [y/N]: N
ApiHandlerFunction may not have authorization defined, Is this okay? [y/N]: y
Save arguments to configuration file [Y/n]: Y
SAM configuration file [samconfig.toml]: samconfig.toml
SAM configuration environment [default]: default
```

Wait for deployment to complete (3-5 minutes).

### Copy the API URL

After successful deployment, you'll see outputs:

```
CloudFormation outputs from deployed stack
────────────────────────────────────────────────────────
Outputs
────────────────────────────────────────────────────────
Key                 ApiUrl
Description         API Gateway endpoint URL
Value               https://abc123xyz.execute-api.ap-south-1.amazonaws.com/Prod

Key                 ApiId
Description         API Gateway ID
Value               abc123xyz

Key                 DynamoDBTable
Description         DynamoDB table name
Value               SchemeRules
────────────────────────────────────────────────────────
```

**IMPORTANT**: Copy the `ApiUrl` value. You'll need it in Step 6.

---

## Step 5: Seed DynamoDB with PM Kisan Rules

```bash
cd backend
node scripts/seedDynamo.js
```

Expected output:
```
Loading PM Kisan rules from JSON file...
Loaded rules for scheme: pm-kisan
Putting item into DynamoDB table: SchemeRules...
✅ Successfully seeded DynamoDB with PM Kisan rules!
   Scheme ID: pm-kisan
   Version: 2024
   Table: SchemeRules
```

---

## Step 6: Configure Frontend Environment Variable

Edit `frontend/.env.local` and replace with your API URL from Step 4:

```bash
cd frontend
```

Edit `.env.local`:
```
VITE_API_URL=https://YOUR-API-ID.execute-api.ap-south-1.amazonaws.com/Prod
```

Replace `YOUR-API-ID` with the actual API ID from Step 4.

---

## Step 7: Test Locally

Test the complete flow locally before deploying frontend:

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Test Checklist

- [ ] Language selection works (Hindi and English)
- [ ] Scheme overview loads correctly
- [ ] Form accepts all inputs
- [ ] Submit button is disabled until all fields are filled
- [ ] Loading screen appears
- [ ] Results screen shows:
  - [ ] Eligible state with documents list
  - [ ] Ineligible state with alternative schemes
  - [ ] AI-generated explanation displays
- [ ] "Apply Now" opens pmkisan.gov.in
- [ ] "Check Another Scheme" returns to overview

If all tests pass, proceed to Step 8.

---

## Step 8: Deploy Frontend to AWS Amplify

### Option A: GitHub Integration (Recommended)

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SahayakAI"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/sahayakai.git
   git push -u origin main
   ```

2. **Connect to AWS Amplify**:
   - Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"
   - Select "GitHub" and authorize
   - Choose your repository: `sahayakai`
   - Branch: `main`

3. **Configure build settings**:
   - Build settings should auto-detect from `infrastructure/amplify.yml`
   - If not, manually set:
     - Build command: `npm run build`
     - Base directory: `frontend`
     - Output directory: `dist`

4. **Add environment variable**:
   - In Amplify console, go to "Environment variables"
   - Add variable:
     - Key: `VITE_API_URL`
     - Value: `https://YOUR-API-ID.execute-api.ap-south-1.amazonaws.com/Prod`

5. **Deploy**:
   - Click "Save and deploy"
   - Wait 3-5 minutes for build and deployment
   - Your app will be live at: `https://main.XXXXX.amplifyapp.com`

### Option B: Manual Upload

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to Amplify**:
   - Go to AWS Amplify Console
   - Click "New app" → "Deploy without Git"
   - App name: `sahayakai`
   - Environment name: `production`
   - Drag and drop the `dist/` folder
   - Add environment variable `VITE_API_URL` in settings

---

## Step 9: Verify Production Deployment

1. Open your Amplify URL
2. Complete the full user flow:
   - Select language
   - View scheme overview
   - Fill eligibility form
   - Check results

3. Test both scenarios:
   - Eligible user (small farmer, 1.5 hectares, no exclusions)
   - Ineligible user (government employee)

---

## Step 10: Enable Bedrock Access (If Not Already Enabled)

If you get errors about Bedrock access:

1. Go to AWS Bedrock Console: https://console.aws.amazon.com/bedrock/
2. Click "Model access" in left sidebar
3. Click "Manage model access"
4. Enable "Claude 3 Haiku"
5. Click "Save changes"
6. Wait 2-3 minutes for access to be granted

---

## Troubleshooting

### Backend Issues

**Error: "ResourceNotFoundException: Table SchemeRules not found"**
- Solution: Run `node scripts/seedDynamo.js` again

**Error: "AccessDeniedException: User is not authorized to perform: bedrock:InvokeModel"**
- Solution: Enable Bedrock model access (see Step 10)

**Error: "CORS policy error"**
- Solution: Check that CORS headers are in SAM template under `Globals.Api.Cors`

### Frontend Issues

**Error: "Failed to fetch" or "Network error"**
- Check that `VITE_API_URL` is set correctly in `.env.local` or Amplify environment variables
- Verify API Gateway URL is accessible: `curl YOUR-API-URL/scheme-data?schemeId=pm-kisan`

**Blank screen or "Cannot GET /"**
- Check that build output is in `dist/` folder
- Verify Amplify build settings point to correct directories

### DynamoDB Issues

**Error: "CredentialsProviderError"**
- Run `aws configure` again
- Verify credentials with `aws sts get-caller-identity`

---

## Cost Estimate

For 10,000 users/month (2 checks per user):

| Service | Cost |
|---------|------|
| AWS Amplify | $0 (free tier) |
| Lambda | ~$5 |
| API Gateway | ~$3 |
| Bedrock (Claude Haiku) | ~$15 |
| Translate | ~$10 |
| DynamoDB | $0 (free tier) |
| **Total** | **~$33/month** |

---

## Cleanup (To Avoid Charges)

To delete all resources:

```bash
# Delete backend stack
cd backend
sam delete --stack-name sahayakai-backend

# Delete Amplify app
# Go to Amplify Console → Select app → Actions → Delete app
```

---

## Next Steps

- Add more schemes (PM Fasal Bima, MGNREGS)
- Implement user authentication
- Add document upload functionality
- Enable regional languages
- Set up monitoring and alerts
- Configure custom domain

---

## Support

For issues or questions:
- Check AWS CloudWatch Logs for Lambda errors
- Review API Gateway logs
- Test locally first before deploying changes

---

**Deployment Complete! 🎉**

Your SahayakAI application is now live and helping citizens check their eligibility for government schemes.
