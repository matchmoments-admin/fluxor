# Fluxor Setup Guide

This guide covers all the steps needed to deploy Fluxor to production.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Convex Setup](#convex-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [GoDaddy Domain Connection](#godaddy-domain-connection)
5. [Clerk Authentication](#clerk-authentication)

---

## Environment Variables

### Required Variables

Your `.env.local` file should contain:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://striped-puma-333.convex.cloud
CONVEX_DEPLOYMENT=dev:striped-puma-333
FLUXOR_CONVEX_INTERNAL_KEY=29vHjW3c3BJ2vcq87Rd4dKl1WNuPWsucqsUZhfxma5c=

# AI Provider - Gemini
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyBYujdTL13o5gswzQ3oyGQsXvEqSyIpT3o

# Firecrawl Web Scraping (optional)
FIRECRAWL_API_KEY=fc-86e769db9e1445b2b21983c24f3368da

# Sentry Error Tracking (optional)
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Inngest (for background jobs)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

---

## Convex Setup

### Step 1: Install Convex CLI
```bash
npm install -g convex
```

### Step 2: Login to Convex
```bash
npx convex login
```

### Step 3: Initialize Convex (if not already done)
```bash
npx convex dev
```
This will:
- Create a Convex deployment
- Give you a `NEXT_PUBLIC_CONVEX_URL`
- Set up the development environment

### Step 4: Add Environment Variables to Convex

Go to [Convex Dashboard](https://dashboard.convex.dev/) and:

1. Select your deployment: `striped-puma-333`
2. Click **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `FLUXOR_CONVEX_INTERNAL_KEY`
   - **Value**: `29vHjW3c3BJ2vcq87Rd4dKl1WNuPWsucqsUZhfxma5c=`
4. Click **Save**

### Step 5: Deploy Convex Functions

For production:
```bash
npx convex deploy
```

This will:
- Deploy all functions in the `convex/` directory
- Create the production deployment
- Give you a production `NEXT_PUBLIC_CONVEX_URL`

**Important**: Update your Vercel environment variables with the production Convex URL!

---

## Vercel Deployment

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository: `matchmoments-admin/fluxor`
4. Click **Import**

### Step 2: Configure Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all the following variables for **Production**, **Preview**, and **Development**:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | From Clerk Dashboard |
| `CLERK_SECRET_KEY` | `sk_test_...` | From Clerk Dashboard |
| `CLERK_JWT_ISSUER_DOMAIN` | `https://sure-platypus-70.clerk.accounts.dev` | From Clerk Dashboard |
| `NEXT_PUBLIC_CONVEX_URL` | `https://striped-puma-333.convex.cloud` | From Convex Dashboard (use production URL for production!) |
| `CONVEX_DEPLOYMENT` | `dev:striped-puma-333` | From Convex Dashboard |
| `FLUXOR_CONVEX_INTERNAL_KEY` | `29vHjW3c3BJ2vcq87Rd4dKl1WNuPWsucqsUZhfxma5c=` | Internal auth key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIzaSyBYujdTL13o5gswzQ3oyGQsXvEqSyIpT3o` | From Google AI Studio |
| `FIRECRAWL_API_KEY` | `fc-86e769db9e1445b2b21983c24f3368da` | From Firecrawl |

3. Click **Save** after each variable

### Step 3: Deploy

Once environment variables are set:
1. Push your code to GitHub (main branch)
2. Vercel will automatically deploy
3. Wait for the build to complete
4. Your app will be available at `https://your-project.vercel.app`

---

## GoDaddy Domain Connection

### Step 1: Get Vercel DNS Records

In your Vercel project:

1. Go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `fluxor.au`
4. Vercel will show you the required DNS records:
   - Type: `A` | Value: `76.76.21.21`
   - Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

### Step 2: Configure GoDaddy DNS

1. Log in to [GoDaddy](https://www.godaddy.com/)
2. Go to **My Products** → **Domains**
3. Find `fluxor.au` and click **DNS**
4. Click **Manage DNS**

### Step 3: Add DNS Records

#### For Root Domain (`fluxor.au`):

1. Find the existing `A` record with `@` as the name
2. Click **Edit** (pencil icon)
3. Change the value to: `76.76.21.21`
4. Set TTL to `600 seconds` (10 minutes)
5. Click **Save**

#### For WWW Subdomain (`www.fluxor.au`):

1. Click **Add** → **CNAME**
2. Set:
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: `600 seconds`
3. Click **Save**

### Step 4: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate globally
- Check status at: https://www.whatsmydns.net/
- Vercel will automatically verify and enable HTTPS

### Step 5: Verify in Vercel

Back in Vercel:
1. Go to **Settings** → **Domains**
2. You should see `fluxor.au` with a green checkmark
3. SSL certificate will be automatically provisioned

---

## Clerk Authentication

### Current Status
✅ Clerk is already working - you mentioned you can register users successfully!

### For Production (Recommended)

You're currently using Clerk **development keys**. For production:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Click on your application
3. Go to **API Keys** in the sidebar
4. Switch to the **Production** tab
5. Copy the production keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Update these in **Vercel** environment variables
7. Redeploy your application

**Note**: Development keys have rate limits and should not be used in production.

---

## Inngest Setup (for Background Jobs)

Fluxor uses Inngest for background job processing (like AI message generation).

### Step 1: Create Inngest Account

1. Go to [Inngest](https://www.inngest.com/)
2. Sign up / Log in
3. Create a new app

### Step 2: Get API Keys

1. In your Inngest dashboard, go to **Settings**
2. Copy:
   - **Event Key**
   - **Signing Key**

### Step 3: Add to Vercel

Add these environment variables in Vercel:
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`

### Step 4: Register Inngest Endpoint

1. In Inngest dashboard, go to **Apps**
2. Click **Create App** or edit existing
3. Set the endpoint URL to: `https://fluxor.au/api/inngest`
4. Click **Sync**

---

## Troubleshooting

### 500 Error on `/api/messages`

**Cause**: Missing `FLUXOR_CONVEX_INTERNAL_KEY` in Convex or Vercel

**Fix**:
1. Check Convex Dashboard → Environment Variables
2. Check Vercel → Settings → Environment Variables
3. Redeploy both after adding

### WebSocket Connection Issues

**Cause**: Convex URL mismatch or missing environment variable

**Fix**:
1. Ensure `NEXT_PUBLIC_CONVEX_URL` is correctly set in Vercel
2. Make sure Convex deployment is active
3. Check browser console for specific error

### Build Failures

**Cause**: TypeScript errors or missing dependencies

**Fix**:
1. Run `npm install` locally
2. Run `npm run build` to check for errors
3. Check Vercel build logs for specific errors

---

## Quick Reference

### Deploy Commands

```bash
# Deploy Convex functions
npx convex deploy

# Build Next.js locally
npm run build

# Start local development
npm run dev

# Start Convex dev mode
npx convex dev
```

### Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Convex Dashboard**: https://dashboard.convex.dev/
- **Clerk Dashboard**: https://dashboard.clerk.com/
- **Inngest Dashboard**: https://www.inngest.com/
- **GoDaddy Domain Management**: https://dcc.godaddy.com/domains

---

## Next Steps

1. ✅ Switch to Gemini AI (completed)
2. ✅ Update branding to Fluxor (completed)
3. ⏳ Add environment variables to Vercel
4. ⏳ Add environment variables to Convex
5. ⏳ Connect fluxor.au domain to Vercel
6. ⏳ Set up Inngest for background jobs
7. ⏳ Upgrade to Clerk production keys

Once all steps are complete, your app will be live at **https://fluxor.au**! 🎉
