# Google Apps Script Configuration Fix

## Issue Description

The form submission is currently failing because the Google Apps Script is returning HTML error pages instead of JSON responses. The specific error is:

```
TypeError: ContentService.createTextOutput(...).setMimeType(...).setHeader is not a function
```

## Root Cause

The Google Apps Script code is trying to use `.setHeader()` method on ContentService, which doesn't exist in Google Apps Script. The script needs to be updated and redeployed.

## Solution Steps

### 1. Fix the Google Apps Script Code

The current script in `google-apps-script.gs` is correct and doesn't use `.setHeader()`. This suggests the deployed version is different from the current code.

### 2. Redeploy the Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Open your quotation form script
3. Replace the entire code with the content from `google-apps-script.gs`
4. Click **Deploy** > **New Deployment**
5. Choose **Type**: Web app
6. Set **Execute as**: Me
7. Set **Who has access**: Anyone
8. Click **Deploy**
9. Copy the new web app URL

### 3. Update the Netlify Function

Update the `APPS_SCRIPT_URL` in `netlify/functions/quote-proxy.js` with the new deployment URL.

### 4. Configure Google Sheets (Required)

The script requires a Google Sheet to store submissions:

1. Create a new Google Sheet
2. Copy the Sheet ID from the URL
3. Update `SPREADSHEET_ID` in the Google Apps Script
4. Create a sheet named "Quotation Submissions"
5. Run the `setupSheet()` function in the script editor to initialize headers

### 5. Test the Deployment

Use the test endpoints to verify:
- `GET` request should return: `{"status":"success","message":"Quotation API v3 is running"}`
- `POST` request with form data should return: `{"status":"success","message":"Quotation submitted successfully"}`

## Current Fallback Solution

Until the Google Apps Script is fixed, the form will automatically fall back to a mock endpoint that:
- Accepts all form submissions
- Returns success responses
- Logs the data (but doesn't save to Google Sheets)
- Shows a special message indicating testing mode

## Testing the Fix

Use the test file `test-form.html` to verify:
1. Open `http://localhost:8080/test-form.html`
2. Click "Test Full Submission with Fallback"
3. Should show fallback to mock endpoint working

## Error Handling Improvements

The JavaScript now includes:
- Better error detection for HTML responses
- Automatic fallback to mock endpoint
- Clear user messaging about service status
- Detailed logging for debugging

## Long-term Recommendations

1. Set up proper monitoring for the Google Apps Script
2. Consider migrating to a more reliable backend service
3. Implement proper error tracking and alerting
4. Add health check endpoints for all services