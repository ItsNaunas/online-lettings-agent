# Netlify CORS Proxy Setup

This document outlines the CORS proxy solution implemented to resolve CORS issues when calling Google Apps Script from the browser.

## What was implemented

1. **Netlify Function**: Created `netlify/functions/quote-proxy.js` that acts as a CORS proxy
2. **Package Management**: Added `package.json` with `node-fetch` dependency
3. **Frontend Update**: Modified `script.js` to send JSON data to the proxy instead of directly to Apps Script
4. **Configuration**: Added `netlify.toml` for proper deployment configuration

## Files Modified/Created

- ✅ `netlify/functions/quote-proxy.js` - CORS proxy function
- ✅ `package.json` - Dependencies management
- ✅ `netlify.toml` - Netlify configuration
- ✅ `script.js` - Updated fetch call to use proxy
- ✅ `package-lock.json` & `node_modules/` - Installed dependencies

## How it works

1. **Frontend** sends JSON data to `/.netlify/functions/quote-proxy`
2. **Proxy function** handles OPTIONS preflight with proper CORS headers
3. **Proxy function** converts JSON to URL-encoded form data
4. **Proxy function** forwards request to Google Apps Script
5. **Proxy function** returns Apps Script response with CORS headers

## Deployment Instructions

### Option 1: Deploy to existing Netlify site
```bash
# If already connected to Netlify
npx netlify deploy --prod
```

### Option 2: Deploy to new Netlify site
```bash
# Login to Netlify
npx netlify login

# Initialize new site
npx netlify init

# Deploy
npx netlify deploy --prod
```

### Option 3: Git-based deployment
1. Commit all changes to Git
2. Connect repository to Netlify via web interface
3. Netlify will auto-deploy on pushes

## Testing

After deployment, test the flow:

1. Open your Netlify site
2. Fill out the quotation form
3. Submit the form
4. Check browser developer tools - should see no CORS errors
5. Verify data appears in Google Sheets

## Key Changes Made

### Frontend (script.js)
- Changed endpoint from Apps Script URL to `/.netlify/functions/quote-proxy`
- Now sends JSON data instead of URL-encoded form data
- Removed custom CORS handling (proxy handles it now)

### Backend (Netlify Function)
- Handles OPTIONS preflight requests with proper CORS headers
- Converts JSON input to URL-encoded format for Apps Script
- Proxies requests and responses between frontend and Apps Script
- Includes error handling and logging

## CORS Headers Implemented

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Benefits

- ✅ No more CORS preflight blocking
- ✅ Clean separation of concerns
- ✅ Maintains existing Apps Script compatibility
- ✅ Better error handling and logging
- ✅ Scalable serverless architecture