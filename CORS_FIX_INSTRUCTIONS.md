# CORS Error Fix - Step by Step Instructions

## Problem
Your quotation form is failing with CORS errors when trying to submit to Google Apps Script:

```
Access to fetch at 'https://script.google.com/macros/s/AKfycbwAb5m_epLiIDJ6UCi-0ETiEYkhJCF63bjjamB3LnLQ2Y4vDewvwD35nxvU44IUDh8V/exec' from origin 'https://clever-bublanina-1af2bc.netlify.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

I've already fixed the Google Apps Script code (`google-apps-script.gs`) to include proper CORS headers. Now you need to redeploy it.

### Step 1: Update Your Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Open your existing project with the quotation form handler
3. Replace the entire contents with the updated `google-apps-script.gs` file from this project
4. Make sure to update the configuration variables:
   - `SPREADSHEET_ID`: Your Google Sheet ID
   - `BUSINESS_EMAIL`: Your business email address
   - `SHEET_NAME`: "Quotation Submissions"

### Step 2: Redeploy the Web App

**CRITICAL: You must create a NEW deployment, not update the existing one**

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type  
3. Set the following:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
   - **Description**: "Fixed CORS headers for quotation form"
4. Click "Deploy"
5. **Copy the new Web App URL** - it will be different from your current one

### Step 3: Update the Web App URL in Your Code

The new URL will look like:
```
https://script.google.com/macros/s/NEW_SCRIPT_ID/exec
```

You need to update the `APPS_SCRIPT_ENDPOINT` in your `script.js` file:

1. Find line 1722 in `script.js`
2. Replace the current URL with your new Web App URL

### Step 4: Test the Fix

1. Deploy your updated website
2. Fill out the quotation form
3. Submit it - it should now work without CORS errors

## What Was Fixed

### 1. Added CORS Headers
The Google Apps Script now returns proper CORS headers:
```javascript
.setHeaders({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});
```

### 2. Added OPTIONS Handler
Added support for CORS preflight requests:
```javascript
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600'
    });
}
```

## Verification

After completing these steps, you should see:
1. No more CORS errors in the browser console
2. Successful form submissions
3. Data appearing in your Google Sheet
4. Email notifications being sent

## If It Still Doesn't Work

1. **Check the Web App URL**: Make sure you're using the NEW deployment URL
2. **Verify Permissions**: Ensure the deployment is set to "Anyone" access
3. **Check Browser Console**: Look for any new error messages
4. **Test with a Simple Request**: Try accessing the Web App URL directly in a browser

## Important Notes

- You must use the NEW deployment URL, not the old one
- The deployment must be set to "Anyone" access
- Make sure to save and redeploy after making changes to the Apps Script
- CORS headers are now included in both success and error responses